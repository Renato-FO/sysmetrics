import { getCpuUsage } from "./getCpuUsage.js";
import { getGpuInfo } from "./getGpuInfo.js";
import { getMemoryUsage } from "./getMemoryUsage.js";
import { getSystemInfo } from "./getSystemInfo.js";
import { getTopProcesses } from "./getTopProcesses.js";

export const windows = {
  getCpuUsage,
  getGpuInfo,
  getMemoryUsage,
  getSystemInfo,
  getTopProcesses,
};
