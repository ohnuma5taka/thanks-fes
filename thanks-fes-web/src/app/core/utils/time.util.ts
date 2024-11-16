export const sleep = async (msec: number) =>
  await new Promise((resolve) => setTimeout(resolve, msec));
