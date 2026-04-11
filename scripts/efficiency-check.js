const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runEfficiencyCheck(dir) {
  console.log(`\nRunning Efficiency Checks for: ${dir}`);
  const absoluteDir = path.resolve(dir);
  
  // 1. Depcheck
  try {
    console.log('--- Unused Dependency Check ---');
    const depcheckPath = path.join(absoluteDir, 'node_modules/.bin/depcheck');
    const output = execSync(`${depcheckPath} ${absoluteDir} --json`, { encoding: 'utf8' });
    console.log(output);
  } catch (err) {
    // depcheck exits with non-zero if unused deps are found
    if (err.stdout) {
      console.log(err.stdout);
    } else {
      console.error('Error running depcheck:', err.message);
    }
  }

  // 2. Build Time
  console.log('\n--- Build Time Check ---');
  const start = Date.now();
  try {
    execSync('npm run build', { cwd: absoluteDir, stdio: 'ignore' });
    const duration = (Date.now() - start) / 1000;
    console.log(`Build completed in ${duration}s`);
  } catch (err) {
    console.error('Build failed during efficiency check');
  }

  // 3. Bundle Stats (assuming the plugin is configured)
  console.log('\n--- Bundle Stats ---');
  const statsPath = path.join(absoluteDir, '.next/stats.json'); // Typical Next.js stats location if configured
  if (fs.existsSync(statsPath)) {
    const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
    console.log(`Bundle Size: ${(stats.size / 1024).toFixed(2)} KB`);
  } else {
    console.log('Bundle stats not found (stats.json). Make sure bundle-stats-webpack-plugin is configured in next.config.js');
  }
}

const targetDirs = ['./resume-site'];
targetDirs.forEach(runEfficiencyCheck);
