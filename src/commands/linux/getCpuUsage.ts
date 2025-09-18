import { genericExecutor } from "./utils.js";

async function getCpuTimes() {
  const output = await genericExecutor("cat /proc/stat");
  const lines = output.split("\n");
  const cpuLine = lines[0];
  const values = cpuLine.split(" ").slice(2).map(Number);

  return {
    idle: values[3],
    total: values.reduce((a, b) => a + b, 0),
  };
}

export async function getCpuUsage(): Promise<number> {
  const start = await getCpuTimes();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const end = await getCpuTimes();

  const idleDifference = end.idle - start.idle;
  const totalDifference = end.total - start.total;

  if (totalDifference === 0) {
    return 0;
  }

  const usage = (1 - idleDifference / totalDifference) * 100;
  return Math.max(0, Math.min(100, usage));
}
