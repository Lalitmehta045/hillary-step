const fs = require('fs');

function replaceAll(str, find, replace) {
  return str.split(find).join(replace);
}

function patchFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix prisma mocks generally across all files
  content = content.replace(/(prisma\.[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+)\.mockResolvedValue/g, '($1 as jest.Mock).mockResolvedValue');
  content = content.replace(/(prisma\.[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+)\.mockRejectedValue/g, '($1 as jest.Mock).mockRejectedValue');

  if (filePath.includes('applications.service.spec.ts')) {
    content = replaceAll(content, "{ fullName: 'John Doe' }", "{ fullName: 'John Doe', email: 'john@example.com' } as any");
    content = replaceAll(content, "service.create({})", "service.create({} as any)");
    content = replaceAll(content, "'NEW'", "'NEW' as any");
  }

  if (filePath.includes('contact.service.spec.ts')) {
    content = replaceAll(content, "service.create({})", "service.create({} as any)");
  }

  if (filePath.includes('resume.controller.spec.ts')) {
    content = replaceAll(content, "parseResume: jest.fn().mockReturnValue({ skills: ['Jest'] })", "parseResume: jest.fn().mockReturnValue({ skills: ['Jest'] } as any)");
  }
  
  if (filePath.includes('jobs.service.ts')) {
    content = replaceAll(content, "status: JobStatus.PUBLISHED", "status: 'PUBLISHED' as any");
  }

  fs.writeFileSync(filePath, content);
}

patchFile('src/contact/contact.service.spec.ts');
patchFile('src/admin/admin.service.spec.ts');
patchFile('src/applications/applications.service.spec.ts');
patchFile('src/auth/auth.service.spec.ts');
patchFile('src/auth/session.service.spec.ts');
patchFile('src/audit/audit.service.spec.ts');
patchFile('src/jobs/jobs.service.ts');
patchFile('src/resume/resume.controller.spec.ts');
