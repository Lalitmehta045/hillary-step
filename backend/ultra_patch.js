const fs = require('fs');

function patch(filePath, replaceFn) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = replaceFn(content);
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log('Patched ' + filePath);
  }
}

patch('src/admin/admin.controller.spec.ts', c => {
  return c.replace(/let service: AdminService;\s*/, '')
          .replace(/service = module\.get<AdminService>\(AdminService\);\s*/, '');
});

patch('src/admin/admin.controller.ts', c => {
  return c.replace(/req\.user\.id/g, '(req as unknown as { user: { id: string } }).user.id');
});

patch('src/admin/admin.service.spec.ts', c => {
  return c.replace(/let prisma: PrismaService;\s*/, '')
          .replace(/prisma = module\.get<PrismaService>\(PrismaService\);\s*/, '');
});

patch('src/admin/admin.service.ts', c => {
  return c.replace(/const \{ passwordHash, \.\.\.adminData \} = admin;/g, 'const { passwordHash, ...adminData } = admin;\n    void passwordHash;');
});

patch('src/audit/audit.service.ts', c => {
  return c.replace(/req\.headers\['x-forwarded-for'\] \|\| req\.ip;/g, 'String(req.headers[\\"x-forwarded-for\\"] || req.ip);');
});

patch('src/auth/auth.controller.ts', c => {
  return c.replace(/const \{ _, __, \.\.\.adminData \} = admin;/g, 'const { passwordHash, mfaSecret, ...adminData } = admin;\n    void passwordHash;\n    void mfaSecret;');
});

patch('src/common/decorators/current-admin.decorator.ts', c => {
  let res = c.replace(/const request = ctx\.switchToHttp\(\)\.getRequest\(\);/g, "const request = ctx.switchToHttp().getRequest() as { admin: import('@prisma/client').Admin };");
  return res.replace(/return request\.admin;/g, "return request.admin;");
});

patch('src/common/filters/http-exception.filter.ts', c => {
  let res = c.replace(/const request = ctx\.getRequest\(\);/g, "const request = ctx.getRequest() as { url: string };");
  return res.replace(/const response = ctx\.getResponse\(\);/g, "const response = ctx.getResponse() as any;"); // FastifyReply has many methods, 'any' might still error? 
});
patch('src/common/filters/http-exception.filter.ts', c => {
  return c.replace(/const response = ctx\.getResponse\(\) as any;/g, "const response = ctx.getResponse() as { status: (c: number) => { send: (o: unknown) => void } };");
});

patch('src/common/guards/auth.guard.ts', c => {
  let res = c.replace(/const request = context\.switchToHttp\(\)\.getRequest\(\);/g, "const request = context.switchToHttp().getRequest() as { headers: Record<string, string>, admin: unknown };");
  return res;
});

patch('src/common/guards/roles.guard.ts', c => {
  let res = c.replace(/const request = context\.switchToHttp\(\)\.getRequest\(\);/g, "const request = context.switchToHttp().getRequest() as { admin: { role: string } };");
  return res;
});

patch('src/common/interceptors/logging.interceptor.ts', c => {
  return c.replace(/\$\{userAgent\}/g, "${String(userAgent)}")
          .replace(/\$\{ip\}/g, "${String(ip)}");
});

patch('src/common/interceptors/transform.interceptor.ts', c => {
  return c.replace(/const request = ctx\.getRequest\(\);/g, "const request = ctx.getRequest() as { url: string };");
});

patch('src/common/utils/sanitize.util.ts', c => {
  return c.replace(/return obj;/g, "return obj as T;");
});

patch('src/contact/contact.controller.spec.ts', c => {
  return c.replace(/const context = \{[\s\S]*?\}\);\s*\n/, '');
});

patch('src/database/prisma.service.ts', c => {
  let res = c.replace(/e: any/g, 'e: unknown');
  res = res.replace(/const model = this\[modelKey\];/g, "const model = (this as unknown as Record<string, { deleteMany: () => Promise<void> }>)[modelKey];");
  res = res.replace(/return model\.deleteMany\(\);/g, "return model.deleteMany();");
  return res;
});

console.log("Done");
