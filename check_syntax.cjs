const fs = require('fs');
const { execSync } = require('child_process');

try {
  const html = fs.readFileSync('index.html', 'utf8');
  // Extract script blocks
  const scriptRegex = /<script>([\s\S]*?)<\/script>/gi;
  let match;
  let count = 0;
  
  while ((match = scriptRegex.exec(html)) !== null) {
    count++;
    const js = match[1];
    const tempFile = `__temp_script_${count}.cjs`;
    fs.writeFileSync(tempFile, js);
    console.log(`Checking block ${count}...`);
    try {
      execSync(`node --check ${tempFile}`);
      console.log(`Block ${count} is syntactically correct.`);
    } catch (err) {
      console.error(`Syntax error in script block ${count}:`, err.message);
    }
    fs.unlinkSync(tempFile);
  }
} catch (e) {
  console.error("Failed to run syntax check:", e);
}
