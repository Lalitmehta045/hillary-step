const { exec } = require('child_process');
const fs = require('fs');
exec('npx eslint src/**/*.ts', (err, stdout, stderr) => {
  fs.writeFileSync('lint.txt', stdout + '\n' + stderr);
});
