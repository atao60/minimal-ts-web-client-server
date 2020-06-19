import { FSWatcher, WatchOptions, watch } from 'chokidar';

export function getWatcher(
  folder: string,
  options: {
    [key: string]: any;
  } = {}
): FSWatcher {
  const fullOptions = {
    ...options,
    recursive: true
  } as WatchOptions;

  const watcher = watch(folder, fullOptions);

  watcher.on('error', error => {
    console.error(`Code watcher on ${folder}, error: `, error);
  });

  return watcher;
}
