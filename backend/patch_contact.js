const fs = require('fs');
let file = 'src/contact/contact.service.spec.ts';
let lines = fs.readFileSync(file, 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('( as jest.Mock)')) {
    if (lines[i].includes('validationError') || lines[i].includes('duplicateError')) {
       lines[i] = lines[i].replace('( as jest.Mock)', '(prisma.enquiry.create as jest.Mock)');
    } else if (lines[i].includes('mockData') || lines[i].includes('[]')) {
       lines[i] = lines[i].replace('( as jest.Mock)', '(prisma.enquiry.findMany as jest.Mock)');
    } else if (lines[i].includes('(1)') || lines[i].includes('(0)')) {
       lines[i] = lines[i].replace('( as jest.Mock)', '(prisma.enquiry.count as jest.Mock)');
    } else if (lines[i].includes('null') && i < 110) {
       lines[i] = lines[i].replace('( as jest.Mock)', '(prisma.enquiry.findFirst as jest.Mock)');
    } else if (lines[i].includes('null') && i > 110) {
       lines[i] = lines[i].replace('( as jest.Mock)', '(prisma.enquiry.findUnique as jest.Mock)');
    } else if (lines[i].includes('mockEnquiry')) {
       lines[i] = lines[i].replace('( as jest.Mock)', '(prisma.enquiry.findUnique as jest.Mock)');
    } else if (lines[i].includes('id:') || lines[i].includes('{')) {
       // if previous line has update, we know. But let's just make id:'1' findUnique and { update
       if (lines[i].includes('id:')) {
           lines[i] = lines[i].replace('( as jest.Mock)', '(prisma.enquiry.findUnique as jest.Mock)');
       } else {
           lines[i] = lines[i].replace('( as jest.Mock)', '(prisma.enquiry.update as jest.Mock)');
       }
    } else {
       lines[i] = lines[i].replace('( as jest.Mock)', '(prisma.enquiry.update as jest.Mock)');
    }
  }
}
fs.writeFileSync(file, lines.join('\n'));
