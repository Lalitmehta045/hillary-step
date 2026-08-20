const fs = require('fs');

let file = 'src/admin/admin.controller.spec.ts';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(/user: \{ id: 'admin-123' \}/g, "admin: { id: 'admin-123' }");
fs.writeFileSync(file, code);

let file2 = 'src/resume/resume.controller.spec.ts';
let code2 = fs.readFileSync(file2, 'utf8');
code2 = code2.replace(/parsedData: \{ skills: \['Jest'\] \}/g, "parsedData: Promise.resolve({ skills: ['Jest'] })");
fs.writeFileSync(file2, code2);

console.log("Done");
