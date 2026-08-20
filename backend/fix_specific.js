const fs = require('fs');

function replaceFile(file, from, to) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.split(from).join(to);
  fs.writeFileSync(file, content);
}

replaceFile('src/applications/applications.controller.spec.ts', 
  "updateStatus('1', { status: 'REVIEWED' }, { id: '1' })", 
  "updateStatus('1', { status: 'REVIEWED' }, { id: '1' } as any)");

replaceFile('src/applications/applications.controller.spec.ts', 
  "findAll({ page: 1 }, { id: '1' })", 
  "findAll({ page: 1 }, { id: '1' } as any)");

replaceFile('src/applications/applications.service.spec.ts', 
  "{ fullName: 'John Doe' }", 
  "{ fullName: 'John Doe', email: 'john@example.com' } as any");

replaceFile('src/applications/applications.service.spec.ts', 
  "service.create({})", 
  "service.create({} as any)");

replaceFile('src/applications/applications.service.spec.ts', 
  "'NEW'", 
  "'NEW' as any");

replaceFile('src/contact/contact.service.spec.ts', 
  "service.create({})", 
  "service.create({} as any)");

replaceFile('src/jobs/jobs.service.spec.ts', 
  "const result = await service.create(dto);", 
  "const result = await service.create(dto as any);");

replaceFile('src/resume/resume.controller.spec.ts', 
  "parseResume: jest.fn().mockReturnValue({ skills: ['Jest'] })", 
  "parseResume: jest.fn().mockReturnValue({ skills: ['Jest'] } as any)");

replaceFile('src/jobs/jobs.service.ts', 
  "status: JobStatus.PUBLISHED", 
  "status: 'PUBLISHED' as any");
