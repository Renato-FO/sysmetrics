import { genericExecutor, executeWmicStringQuery } from "./utils.js";

export interface gpuStats {
  memoryUsed: number;
  temperature: number;
  memoryTotal: number;
  vramUsed: number;
}

export function getGpuInfo() {
  async function getGpuType() {
    try {
      const gpuName = await executeWmicStringQuery(
        "wmic path win32_VideoController get name"
      );
      const lowerCaseName = gpuName.toLowerCase();

      const vendors = {
        nvidia: "NVIDIA",
        amd: "AMD",
        intel: "Intel",
      };

      const type =
        Object.entries(vendors).find(([key]) =>
          lowerCaseName.includes(key)
        )?.[1] ?? "Unknown";

      return type;
    } catch (error) {}
  }

  async function getCurrentGpuStatsForNvidia(): Promise<gpuStats> {
    const command =
      "nvidia-smi --query-gpu=utilization.gpu,memory.total,memory.used,temperature.gpu --format=csv,noheader,nounits";

    try {
      const stdout = await genericExecutor(command);
      const parts = stdout.trim().split(", ");

      if (parts.length < 2)
        throw new Error("Invalid output format from nvidia-smi");

      const memoryUsed = parseInt(parts[0], 10);
      const memoryTotal = parseInt(parts[1], 10);
      const vramUsed = parseInt(parts[2], 10);
      const temperature = parseInt(parts[3], 10);

      return {
        memoryUsed,
        temperature,
        memoryTotal,
        vramUsed,
      };
    } catch (error) {
      console.error("Error getting gpu information:", error);
      throw error;
    }
  }

  async function getCurrentGpuStatsForAmd(): Promise<gpuStats> {
    const commands = {
      usage: "amd-smi --show-use --json",
      vram: "amd-smi --show-mem-info vram --json",
      temp: "amd-smi --show-temp --json",
    };

    try {
      const [usageJson, vramJson, tempJson] = await Promise.all([
        genericExecutor(commands.usage),
        genericExecutor(commands.vram),
        genericExecutor(commands.temp),
      ]);

      const usageData = JSON.parse(usageJson);
      const vramData = JSON.parse(vramJson);
      const tempData = JSON.parse(tempJson);

      const cardPath = Object.keys(usageData.card)[0];
      const usagePercent = parseInt(usageData.card[cardPath]["GPU use (%)"]);
      const temp = parseInt(tempData.card[cardPath]["Temperature (C)"]);
      const vramUsed =
        parseInt(vramData.card[cardPath]["VRAM Total Used Memory (B)"]) /
        (1024 * 1024);
      const vramTotal =
        parseInt(vramData.card[cardPath]["VRAM Total Memory (B)"]) /
        (1024 * 1024);

      return {
        memoryUsed: usagePercent,
        temperature: temp,
        memoryTotal: Math.round(vramTotal),
        vramUsed: Math.round(vramUsed),
      };
    } catch (error) {
      console.error("Error getting gpu information:", error);
      throw error;
    }
  }

  async function getCurrentGpuStats(): Promise<gpuStats> {
    try {
      const type = await getGpuType();

      switch (type) {
        case "NVIDIA":
          return await getCurrentGpuStatsForNvidia();
          break;
        case "AMD":
          return await getCurrentGpuStatsForAmd();
          break;
        case "Unknown":
          return {
            memoryUsed: 0,
            temperature: 0,
            memoryTotal: 0,
            vramUsed: 0,
          };
          break;
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
