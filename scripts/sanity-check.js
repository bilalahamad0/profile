const { spawn } = require('child_process');
const http = require('http');

async function checkUrl(url, timeout = 30000) {
  const start = Date.now();
  console.log(`Checking ${url}...`);
  while (Date.now() - start < timeout) {
    try {
      return await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          if (res.statusCode === 200) resolve(true);
          else reject(new Error(`Status: ${res.statusCode}`));
        });
        req.on('error', reject);
        req.end();
      });
    } catch (err) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error(`Timeout waiting for ${url}`);
}

async function runSanityCheck(dir) {
  console.log(`\nStarting Sanity Check for ${dir}...`);
  const child = spawn('npm', ['run', 'start'], { 
    cwd: dir,
    env: { ...process.env, PORT: '3001' } // Use different port
  });

  child.stdout.on('data', (data) => console.log(`[STDOUT] ${data}`));
  child.stderr.on('data', (data) => console.error(`[STDERR] ${data}`));

  try {
    await checkUrl('http://localhost:3001');
    console.log('Sanity check PASSED: App is responding.');
  } catch (err) {
    console.error(`Sanity check FAILED: ${err.message}`);
    process.exit(1);
  } finally {
    child.kill();
  }
}

if (require.main === module) {
  const targetDir = process.argv[2] || '.';
  runSanityCheck(targetDir);
}
