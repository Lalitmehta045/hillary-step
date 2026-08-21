import { Injectable, Logger } from '@nestjs/common';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const execFileAsync = promisify(execFile);

type ExecError = Error & {
  code?: number | string;
  stderr?: string;
  stdout?: string;
};

@Injectable()
export class ScannerService {
  private readonly logger = new Logger(ScannerService.name);

  /**
   * When true, missing scanner binaries abort the upload (fail-closed).
   * Default false so Render/Docker without ClamAV can still accept resumes.
   */
  private isScanRequired(): boolean {
    return process.env.MALWARE_SCAN_REQUIRED === 'true';
  }

  /**
   * Scans a buffer for malware asynchronously.
   * Returns true if clean, false if infected.
   * Throws if the scanner fails while MALWARE_SCAN_REQUIRED=true,
   * or if malware tooling errors for reasons other than "not installed".
   */
  async scanBuffer(buffer: Buffer): Promise<boolean> {
    const tempFilePath = path.join(os.tmpdir(), uuidv4() + '.tmp');
    await fs.writeFile(tempFilePath, buffer);

    try {
      return await this.scanFile(tempFilePath);
    } finally {
      await fs.unlink(tempFilePath).catch(() => {
        // Ignore unlink errors
      });
    }
  }

  private async scanFile(filePath: string): Promise<boolean> {
    // process.platform is easier to stub in tests than os.platform().
    const isWindows = process.platform === 'win32';

    try {
      if (isWindows) {
        const cmd = 'C:\\Program Files\\Windows Defender\\MpCmdRun.exe';
        const args = [
          '-Scan',
          '-ScanType',
          '3',
          '-File',
          filePath,
          '-DisableRemediation',
        ];
        await execFileAsync(cmd, args);
        return true; // Exit code 0 means clean
      }

      // Linux production: prefer clamdscan (daemon), fall back to clamscan
      try {
        await execFileAsync('clamdscan', [
          '--no-summary',
          '--fdpass',
          filePath,
        ]);
        return true;
      } catch (clamdErr: unknown) {
        if (this.isBinaryMissing(clamdErr)) {
          await execFileAsync('clamscan', ['--no-summary', filePath]);
          return true;
        }
        throw clamdErr;
      }
    } catch (e: unknown) {
      const error = e as ExecError;
      this.logger.error(
        `Scanner raw error:`,
        JSON.stringify(e, Object.getOwnPropertyNames(e as object)),
      );

      // On Windows, MpCmdRun returns 2 for malware
      if (isWindows && error.code === 2) {
        this.logger.warn(
          `Malware detected by Windows Defender in: ${filePath}`,
        );
        return false;
      }

      // On Linux, clamscan/clamdscan returns 1 for malware
      if (!isWindows && error.code === 1) {
        this.logger.warn(`Malware detected by ClamAV in: ${filePath}`);
        return false;
      }

      // Scanner not installed on this host (typical Render image without ClamAV)
      if (this.isBinaryMissing(error)) {
        if (this.isScanRequired()) {
          this.logger.error(
            'Malware scanner binary missing and MALWARE_SCAN_REQUIRED=true',
          );
          throw new Error('Malware scan failed or scanner unavailable');
        }
        this.logger.warn(
          'Malware scanner not installed; allowing upload (set MALWARE_SCAN_REQUIRED=true to enforce).',
        );
        return true;
      }

      this.logger.error(
        `Scanner failed or is unavailable: ${error.message || 'Unknown error'}`,
      );
      throw new Error('Malware scan failed or scanner unavailable');
    }
  }

  private isBinaryMissing(error: unknown): boolean {
    const err = error as ExecError;
    if (err?.code === 'ENOENT') return true;
    const msg = `${err?.message || ''} ${err?.stderr || ''}`.toLowerCase();
    return (
      msg.includes('enoent') ||
      msg.includes('not found') ||
      msg.includes('no such file')
    );
  }
}
