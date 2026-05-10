const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const name = args[0];
const type = args[1] || 'ts'; // 'ts' or 'rust'
const targetDir = args[2] || 'packages'; // 'packages' or 'apps'

if (!name) {
  console.error('Usage: node create_package.cjs <name> [ts|rust] [packages|apps]');
  process.exit(1);
}

const skillDir = path.dirname(__dirname);
const assetDir = path.join(skillDir, 'assets', type);
const outputDir = path.join(process.cwd(), targetDir, name);

if (fs.existsSync(outputDir)) {
  console.error(`Error: Directory ${outputDir} already exists.`);
  process.exit(1);
}

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    let content = fs.readFileSync(src, 'utf8');
    content = content.replace(/{{name}}/g, name);
    fs.writeFileSync(dest, content);
  }
}

console.log(`Creating ${type} package '${name}' in ${targetDir}...`);
copyRecursive(assetDir, outputDir);
console.log('Success!');
