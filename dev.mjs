// Starts the API server and the Vite client together. Ctrl+C stops both.
import { spawn } from 'node:child_process';

const processes = [
  { name: 'server', cwd: 'server', args: ['run', 'dev'] },
  { name: 'client', cwd: 'client', args: ['run', 'dev'] },
].map(({ name, cwd, args }) => {
  const child = spawn(`npm ${args.join(' ')}`, { cwd, shell: true, stdio: ['ignore', 'pipe', 'pipe'] });
  const prefix = `[${name}] `;
  for (const stream of [child.stdout, child.stderr]) {
    stream.on('data', (chunk) => {
      for (const line of chunk.toString().split(/\r?\n/)) {
        if (line.trim()) process.stdout.write(prefix + line + '\n');
      }
    });
  }
  child.on('exit', (code) => {
    process.stdout.write(`${prefix}exited with code ${code}\n`);
    stopAll();
  });
  return child;
});

let stopping = false;
function stopAll() {
  if (stopping) return;
  stopping = true;
  for (const child of processes) {
    if (child.exitCode === null) child.kill();
  }
  process.exit();
}

process.on('SIGINT', stopAll);
process.on('SIGTERM', stopAll);
