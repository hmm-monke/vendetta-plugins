const { logger } = (window as any).vendetta;

export default {
  onLoad: () => {
    logger.log("woof");
  },
  onUnload: () => {
    logger.log("woof bye");
  }
};
