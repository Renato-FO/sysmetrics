import { genericExecutor } from "./utils.js";

export interface gpuStats {
  memoryUsed: number;
  temperature: number;
  memoryTotal: number;
  vramUsed: number;
}

function parseKeyValue(stdout: string, key: string): string | null {
  const regex = new RegExp(`${key}:\\s*(.+)`);
  const match = stdout.match(regex);
  return match ? match[1].trim() : null;
}

export function getGpuInfo() {
  async function getGpuType(): Promise<string> {
    try {
      const stdout = await genericExecutor(
        "system_profiler SPDisplaysDataType | grep Chipset"
      );
      const lowerCaseName = stdout.toLowerCase();

      const vendors = {
        nvidia: "NVIDIA",
        amd: "AMD",
        intel: "Intel",
        apple: "Apple",
      };

      const type =
        Object.entries(vendors).find(([key]) =>
          lowerCaseName.includes(key)
        )?.[1] ?? "Unknown";

      return type;
    } catch (error) {
      return "Unknown";
    }
  }

  async function _getCurrentGpuStatsForMac(): Promise<gpuStats> {
    try {
      const stdout = await genericExecutor(
        "powermetrics -n 1 -i 1 --samplers gpu_power"
      );

      const usageMatch = stdout.match(/GPU Busy:\s*(\d+)/);
      const usage = usageMatch ? parseInt(usageMatch[1], 10) : 0;
      const temperature = 0;

      const memoryTotal = 0;
      const vramUsed = 0;

      return {
        memoryUsed: usage,
        temperature,
        memoryTotal,
        vramUsed,
      };
    } catch (error) {
      console.error("Error getting gpu information from powermetrics:", error);
      return { memoryUsed: 0, temperature: 0, memoryTotal: 0, vramUsed: 0 };
    }
  }

  async function getCurrentGpuStatsForNvidia(): Promise<gpuStats> {
    return _getCurrentGpuStatsForMac();
  }

  async function getCurrentGpuStatsForAmd(): Promise<gpuStats> {
    return _getCurrentGpuStatsForMac();
  }

  async function getCurrentGpuStats(): Promise<gpuStats> {
    try {
      const type = await getGpuType();

      switch (type) {
        case "NVIDIA":
        case "AMD":
        case "Intel":
        case "Apple":
          return await _getCurrentGpuStatsForMac();
        case "Unknown":
        default:
          return {
            memoryUsed: 0,
            temperature: 0,
            memoryTotal: 0,
            vramUsed: 0,
          };
      }
    } catch (error) {
      console.error("Error getting gpu stats:", error);
      throw error;
    }
  }

  return {
    getGpuType,
    getCurrentGpuStatsForNvidia,
    getCurrentGpuStatsForAmd,
    getCurrentGpuStats,
  };
}
