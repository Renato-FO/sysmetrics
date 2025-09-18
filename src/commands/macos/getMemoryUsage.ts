import { genericExecutor } from "./utils.js";

export async function getMemoryUsage(): Promise<{ total: number; free: number; used: number; }> {
  const totalMemoryBytes = parseInt(await genericExecutor("sysctl -n hw.memsize"), 10);
  const totalMemoryMB = totalMemoryBytes / 1024 / 1024;

  const vmStatOutput = await genericExecutor("vm_stat");
  const lines = vmStatOutput.split("\n");

  let pageSize = 4096;
  const pageSizeLine = lines.find(line => line.includes("page size"));
  if (pageSizeLine) {
    const match = pageSizeLine.match(/(\d+)/);
    if (match) {
      pageSize = parseInt(match[1], 10);
    }
  }

  const freePagesLine = lines.find(line => line.startsWith("Pages free:"));
  const activePagesLine = lines.find(line => line.startsWith("Pages active:"));

  const freePages = freePagesLine ? parseInt(freePagesLine.split(":")[1].trim().replace(".", ""), 10) : 0;
  const activePages = activePagesLine ? parseInt(activePagesLine.split(":")[1].trim().replace(".", ""), 10) : 0;

  const freeMemoryMB = (freePages * pageSize) / 1024 / 1024;
  const usedMemoryMB = (activePages * pageSize) / 1024 / 1024;

  return {
    total: Math.round(totalMemoryMB),
    free: Math.round(freeMemoryMB),
    used: Math.round(usedMemoryMB),
  };
}
