import { ScannerService } from './scanner.service';
import { execFile } from 'child_process';

jest.mock('child_process', () => ({
  execFile: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  writeFile: jest.fn().mockResolvedValue(undefined),
  unlink: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

const execFileMock = execFile as unknown as jest.Mock;

describe('ScannerService', () => {
  let service: ScannerService;
  const originalEnv = process.env.MALWARE_SCAN_REQUIRED;
  const originalPlatform = process.platform;

  beforeEach(() => {
    service = new ScannerService();
    execFileMock.mockReset();
    delete process.env.MALWARE_SCAN_REQUIRED;
    Object.defineProperty(process, 'platform', {
      configurable: true,
      value: 'linux',
    });
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.MALWARE_SCAN_REQUIRED;
    } else {
      process.env.MALWARE_SCAN_REQUIRED = originalEnv;
    }
    Object.defineProperty(process, 'platform', {
      configurable: true,
      value: originalPlatform,
    });
  });

  /** promisify(execFile) always invokes the last arg as callback. */
  function mockSequence(handlers: Array<(cmd: string) => Error | null>) {
    let i = 0;
    execFileMock.mockImplementation(
      (cmd: string, _args: unknown, cb: unknown) => {
        const callback = typeof _args === 'function' ? _args : (cb as Function);
        const err = handlers[Math.min(i, handlers.length - 1)](cmd);
        i += 1;
        callback(err, { stdout: '', stderr: '' });
        return {} as any;
      },
    );
  }

  it('returns true when clamdscan succeeds', async () => {
    mockSequence([() => null]);
    await expect(service.scanBuffer(Buffer.from('clean'))).resolves.toBe(true);
    expect(execFileMock.mock.calls[0][0]).toBe('clamdscan');
  });

  it('falls back to clamscan when clamdscan is missing', async () => {
    mockSequence([
      () =>
        Object.assign(new Error('spawn clamdscan ENOENT'), { code: 'ENOENT' }),
      () => null,
    ]);

    await expect(service.scanBuffer(Buffer.from('clean'))).resolves.toBe(true);
    expect(execFileMock.mock.calls.map((c) => c[0])).toEqual([
      'clamdscan',
      'clamscan',
    ]);
  });

  it('allows upload when scanner binaries are missing and scan is not required', async () => {
    mockSequence([
      () => Object.assign(new Error('ENOENT'), { code: 'ENOENT' }),
      () => Object.assign(new Error('ENOENT'), { code: 'ENOENT' }),
    ]);

    await expect(service.scanBuffer(Buffer.from('pdf'))).resolves.toBe(true);
  });

  it('throws when scanner missing and MALWARE_SCAN_REQUIRED=true', async () => {
    process.env.MALWARE_SCAN_REQUIRED = 'true';
    mockSequence([
      () => Object.assign(new Error('ENOENT'), { code: 'ENOENT' }),
      () => Object.assign(new Error('ENOENT'), { code: 'ENOENT' }),
    ]);

    await expect(service.scanBuffer(Buffer.from('pdf'))).rejects.toThrow(
      /scanner unavailable/i,
    );
  });

  it('returns false when clamscan detects malware (exit 1)', async () => {
    mockSequence([() => Object.assign(new Error('Infected'), { code: 1 })]);

    await expect(service.scanBuffer(Buffer.from('bad'))).resolves.toBe(false);
  });
});
