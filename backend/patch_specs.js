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

patchFile('src/applications/applications.controller.spec.ts', [
  ["const admin = { id: 'admin-id' };", "const admin = { id: 'admin-id' } as any;"]
]);

patchFile('src/applications/applications.service.spec.ts', [
  ["const data = { fullName: 'John Doe' };", "const data = { fullName: 'John Doe', email: 'j@example.com' } as any;"],
  ["const dto = {}; // Missing required fields", "const dto = {} as any; // Missing required fields"],
  ["status: 'NEW',", "status: 'NEW' as any,"]
]);

patchFile('src/contact/contact.service.spec.ts', [
  ["const dto = {}; // Missing required fields", "const dto = {} as any; // Missing required fields"]
]);

patchFile('src/resume/resume.controller.spec.ts', [
  ["parseResume: jest.fn().mockReturnValue({ skills: ['Jest'] }),", "parseResume: jest.fn().mockReturnValue({ skills: ['Jest'] } as any),"]
]);

patchFile('src/jobs/jobs.service.spec.ts', [
  ["mockPrismaService.job.findUnique.mockResolvedValue(expectedOutput);", "mockPrismaService.job.create.mockResolvedValue(expectedOutput);"]
]);

console.log("Patched successfully");
