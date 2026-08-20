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

patchFile('src/jobs/jobs.service.spec.ts', [
  ["mockPrismaService.job.create.mockResolvedValue(expectedOutput);", "(mockPrismaService.job.create as jest.Mock).mockResolvedValue(expectedOutput);"]
]);

patchFile('src/resume/resume.controller.spec.ts', [
  ["parseResume: jest.fn().mockReturnValue({ skills: ['Jest'] } as any),", "parseResume: jest.fn().mockResolvedValue({ skills: ['Jest'] } as any),"]
]);

console.log("Patched successfully again");
