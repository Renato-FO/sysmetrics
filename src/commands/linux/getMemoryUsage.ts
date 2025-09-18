import { genericExecutor } from "./utils.js";

export async function getMemoryUsage(): Promise<{ total: number; free: number; used: number; }> {
  const output = await genericExecutor("cat /proc/meminfo");
  const lines = output.split("\n");

  const memInfo: { [key: string]: number } = {};
  lines.forEach(line => {
    const [key, value] = line.split(":").map(item => item.trim());
    if (key && value) {
      memInfo[key] = parseInt(value.split(" ")[0], 10);
    }
  });

  const total = memInfo["MemTotal"] / 1024;
  const free = memInfo["MemFree"] / 1024;
  const buffers = memInfo["Buffers"] / 1024;
  const cached = memInfo["Cached"] / 1024;
  const used = total - free - buffers - cached;

  return {
    total: Math.round(total),
    free: Math.round(free),
    used: Math.round(used),
  };
}
