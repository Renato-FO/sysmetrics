import { getCpuUsage } from "./getCpuUsage.js";
import { getMemoryUsage } from "./getMemoryUsage.js";
import { getSystemInfo } from "./getSystemInfo.js";
import { getGpuInfo } from "./getGpuInfo.js";
import { getTopProcesses } from "./getTopProcesses.js";

export const macos = {
  getCpuUsage,
  getMemoryUsage,
  getSystemInfo,
  getGpuInfo,
  getTopProcesses,
};