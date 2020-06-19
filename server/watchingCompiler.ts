import { ChildProcess, spawn } from 'child_process';

export function startTypescriptCompiler(): ChildProcess {
  const watchOptions = ['--pretty', '--preserveWatchOutput'];

  const typescriptProcess = spawn('tsc', [...watchOptions, '--watch']);

  typescriptProcess.stdout.on('data', (data: Buffer) => {
    console.log('Runtime TS compiler, ', data.toString('utf8').trimRight());
  });

  typescriptProcess.stderr.on('data', (data: Buffer) => {
    console.error('[Runtime TS compiler, ', data.toString('utf8').trimRight());
  });

  return typescriptProcess;
}
