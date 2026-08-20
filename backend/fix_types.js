const fs = require('fs');

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix prisma mocks
  content = content.replace(/(prisma\.[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+)\.mockResolvedValue/g, '($1 as jest.Mock).mockResolvedValue');
  content = content.replace(/(prisma\.[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+)\.mockRejectedValue/g, '($1 as jest.Mock).mockRejectedValue');

  // Fix applications.service.spec.ts DTO issues
  if (filePath.includes('applications.service.spec.ts')) {
    content = content.replace(/\{ fullName: 'John Doe' \}/g, "`{ fullName: 'John Doe', email: 'john@example.com' } as any`");
    // Actually, we don't want backticks in the final code, just use double quotes for JS string literal
    content = content.replace(/\{ fullName: 'John Doe' \}/g, "{ fullName: 'John Doe', email: 'john@example.com' } as any");
    content = content.replace(/service\.create\(\{\}\)/g, "service.create({} as any)");
    content = content.replace(/'NEW'/g, "'NEW' as any");
  }

  // Fix contact.service.spec.ts empty object
  if (filePath.includes('contact.service.spec.ts')) {
    content = content.replace(/service\.create\(\{\}\)/g, "service.create({} as any)");
  }

  // Fix jobs.service.ts PUBLISHED status
  if (filePath.includes('jobs.service.ts')) {
    content = content.replace(/status: 'PUBLISHED',/g, "status: 'PUBLISHED' as any,");
  }

  // Fix resume.controller.spec.ts never type
  if (filePath.includes('resume.controller.spec.ts')) {
    content = content.replace(/parseResume: jest\.fn\(\)\.mockReturnValue\(\{ skills: \['Jest'\] \}\)/g, "parseResume: jest.fn().mockReturnValue({ skills: ['Jest'] } as any)");
  }

  fs.writeFileSync(filePath, content);
}

fixFile('src/contact/contact.service.spec.ts');
fixFile('src/admin/admin.service.spec.ts');
fixFile('src/applications/applications.service.spec.ts');
fixFile('src/auth/auth.service.spec.ts');
fixFile('src/auth/session.service.spec.ts');
fixFile('src/audit/audit.service.spec.ts');
fixFile('src/jobs/jobs.service.ts');
fixFile('src/resume/resume.controller.spec.ts');
