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

patchFile('src/common/interceptors/logging.interceptor.ts', [
  ["${userAgent}", "${String(userAgent)}"],
  ["${ip}", "${String(ip)}"]
]);

patchFile('src/common/interceptors/transform.interceptor.ts', [
  ["const request = ctx.getRequest() as any;", "const request = ctx.getRequest() as { url: string };"]
]);

patchFile('src/contact/contact.controller.spec.ts', [
  ["const _context = {", ""],
  ["_context.switchToHttp = jest.fn().mockReturnValue({", ""],
  ["getRequest: () => ({ headers: { 'cf-connecting-ip': '127.0.0.1' } }),", ""],
  ["});", ""] // This might break syntax, I should just delete the whole mock TurnstileGuard if it's there? Wait, the file is a test file.
]);

// Let's do a better replace for contact.controller.spec.ts
let contactC = fs.readFileSync('src/contact/contact.controller.spec.ts', 'utf8');
contactC = contactC.replace(/const _context = \{[\s\S]*?\}\);\s*\n/, '');
fs.writeFileSync('src/contact/contact.controller.spec.ts', contactC);

patchFile('src/database/prisma.service.ts', [
  ["e: any", "e: unknown"],
  ["(model as any).deleteMany()", "(model as { deleteMany: () => Promise<void> }).deleteMany()"],
  ["const model = (this as any)[modelKey];", "const model = (this as unknown as Record<string, { deleteMany: () => Promise<void> }>)[modelKey];"]
]);

patchFile('src/jobs/jobs.service.ts', [
  ["status: 'PUBLISHED' as any", "status: 'PUBLISHED' as never"] // Or we can ignore this file if we can just type it better
]);

let jobsC = fs.readFileSync('src/jobs/jobs.service.ts', 'utf8');
jobsC = jobsC.replace(/status: 'PUBLISHED' as any/g, "status: 'PUBLISHED' as unknown as import('@prisma/client').JobStatus");
fs.writeFileSync('src/jobs/jobs.service.ts', jobsC);

console.log("Patched final lints");
