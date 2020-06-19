export const setupCleanupActions = (
  shutdownActions: Array<() => void>
): void => {
  const sigIntHandler = () => {
    console.error('\n[NODE]', 'Caught SIGINT; shutting down servers.');

    for (let actionToPerform of shutdownActions) {
      actionToPerform();
    }

    process.exit(0);
  };

  process.on('SIGINT', sigIntHandler);
};
