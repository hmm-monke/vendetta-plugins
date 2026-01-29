const { logger } = (window as any).vendetta;

export default {
  onLoad: () => {
    logger.log("Plugin loaded.");
  },
  onUnload: () => {
    logger.log("Plugin unloaded.");
  }
};
