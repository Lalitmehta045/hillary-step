const fs = require('fs');

function replaceAll(str, find, replace) {
  return str.split(find).join(replace);
}

function patchFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  for (let r of replacements) {
    content = replaceAll(content, r[0], r[1]);
  }
  fs.writeFileSync(filePath, content);
}

patchFile('src/resume/resume.controller.spec.ts', [
  ["resumeService.parseResume.mockResolvedValue({ skills: ['Jest'] });", "resumeService.parseResume.mockResolvedValue({ skills: ['Jest'] } as any);"]
]);

patchFile('src/admin/admin.service.ts', [
  ["const { passwordHash, ...adminData } = admin;", "const { passwordHash: _unused, ...adminData } = admin;"]
]);

patchFile('src/applications/applications.controller.spec.ts', [
  ["let service: ApplicationsService;", ""],
  ["service = module.get<ApplicationsService>(ApplicationsService);", ""]
]);

patchFile('src/applications/applications.service.spec.ts', [
  ["let prisma: PrismaService;", ""],
  ["prisma = module.get<PrismaService>(PrismaService);", ""]
]);

patchFile('src/audit/audit.service.spec.ts', [
  ["let prisma: PrismaService;", ""],
  ["prisma = module.get<PrismaService>(PrismaService);", ""]
]);

patchFile('src/contact/contact.controller.spec.ts', [
  ["const context = {", "const _context = {"],
  ["context.switchToHttp", "_context.switchToHttp"]
]);

patchFile('src/auth/auth.controller.ts', [
  ["const { _, __, ...adminData }", "const { passwordHash, mfaSecret, ...adminData }"]
]);

patchFile('src/auth/mfa.service.ts', [
  ["catch (error) {", "catch {"]
]);

patchFile('src/audit/audit.service.ts', [
  ["const details =", "const details: Record<string, unknown> ="]
]);

patchFile('src/common/decorators/current-admin.decorator.ts', [
  ["const request = ctx.switchToHttp().getRequest();", "const request = ctx.switchToHttp().getRequest() as any;"],
  ["return request.admin;", "return request.admin as any;"]
]);

patchFile('src/common/filters/http-exception.filter.ts', [
  ["const request = ctx.getRequest();", "const request = ctx.getRequest() as any;"],
  ["const response = ctx.getResponse();", "const response = ctx.getResponse() as any;"]
]);

patchFile('src/common/guards/auth.guard.ts', [
  ["const request = context.switchToHttp().getRequest();", "const request = context.switchToHttp().getRequest() as any;"]
]);

patchFile('src/common/guards/roles.guard.ts', [
  ["const request = context.switchToHttp().getRequest();", "const request = context.switchToHttp().getRequest() as any;"],
  ["const admin = request.admin;", "const admin = request.admin as any;"]
]);

patchFile('src/common/interceptors/transform.interceptor.ts', [
  ["const request = ctx.getRequest();", "const request = ctx.getRequest() as any;"]
]);

patchFile('src/common/utils/sanitize.util.ts', [
  ["return obj;", "return obj as any;"]
]);

patchFile('src/database/prisma.service.ts', [
  ["this.$on('query', (e: any)", "this.$on('query' as never, (e: any)"],
  ["this.$on('error', (e: any)", "this.$on('error' as never, (e: any)"],
  ["const model = this[modelKey];", "const model = (this as any)[modelKey];"],
  ["return model.deleteMany();", "return (model as any).deleteMany();"]
]);

console.log("Patched lints");
