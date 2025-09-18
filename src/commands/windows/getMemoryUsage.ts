import { executeWmicQuery } from "./utils.js";

export async function getMemoryUsage(): Promise<{
  total: number;
  free: number;
  used: number;
}> {
  try {
    const [totalBytes, freeKilobytes] = await Promise.all([
      executeWmicQuery("wmic ComputerSystem get TotalPhysicalMemory"),
      executeWmicQuery("wmic OS get FreePhysicalMemory"),
    ]);

    const totalMB = Math.round(totalBytes / (1024 * 1024));
    const freeMB = Math.round(freeKilobytes / 1024);
    const usedMB = totalMB - freeMB;

    return { total: totalMB, free: freeMB, used: usedMB };
  } catch (error) {
    console.error("Error getting memory information:", error);
    throw error;
  }
}
