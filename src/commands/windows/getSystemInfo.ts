import { executeWmicStringQuery } from "./utils.js";

export interface SystemInfo {
  cpu: string;
  motherboard: string;
  gpu: string;
}

export async function getSystemInfo(): Promise<SystemInfo> {
  const [gpu, cpu, motherboard] = await Promise.all([
    executeWmicStringQuery("wmic path win32_VideoController get name"),
    executeWmicStringQuery("wmic cpu get name"),
    executeWmicStringQuery("wmic baseboard get product"),
  ]);

  return {
    cpu: cpu || "Cannot get CPU name",
    motherboard: motherboard || "Cannot get motherboard name",
    gpu: gpu || "Cannot get GPU name",
  };
}
