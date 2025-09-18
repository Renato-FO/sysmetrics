import { genericExecutor } from "./utils.js";

export async function getCpuUsage(): Promise<number> {
  const output = await genericExecutor('top -l 1 | grep "CPU usage"');
  const usageLine = output.trim();
  const idleMatch = usageLine.match(/(\d+\.\d+)% idle/);

  if (!idleMatch) {
    throw new Error("Could not parse CPU usage from top command");
  }

  const idle = parseFloat(idleMatch[1]);
  const usage = 100 - idle;

  return Math.max(0, Math.min(100, usage));
}
