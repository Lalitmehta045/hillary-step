import { Injectable, Logger } from '@nestjs/common';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const execFileAsync = promisify(execFile);

@Injectable()
export class ScannerService {
  private readonly logger = new Logger(ScannerService.name);

  /**
   * Scans a buffer for malware asynchronously.
   * Returns true if clean, false if infected.
   * Throws an error if the scanner is unavailable or fails.
   */
  async scanBuffer(buffer: Buffer): Promise<boolean> {
    const tempFilePath = path.join(os.tmpdir(), uuidv4() + '.tmp');
    await fs.writeFile(tempFilePath, buffer);

    try {
      const isClean = await this.scanFile(tempFilePath);
      return isClean;
    } finally {
      await fs.unlink(tempFilePath).catch(() => {
        // Ignore unlink errors
      });
    }
  }

  private async scanFile(filePath: string): Promise<boolean> {
    const isWindows = os.platform() === 'win32';

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
      } else {
        // Linux production: Use clamscan/clamdscan
        await execFileAsync('clamdscan', [
          '--no-summary',
          '--fdpass',
          filePath,
        ]);
        return true;
      }
    } catch (e: unknown) {
      const error = e as { code?: number; message?: string };
      this.logger.error(
        `Scanner raw error:`,
        JSON.stringify(e, Object.getOwnPropertyNames(e)),
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

      this.logger.error(
        `Scanner failed or is unavailable: ${error.message || 'Unknown error'}`,
      );
      throw new Error('Malware scan failed or scanner unavailable');
    }
  }
}
