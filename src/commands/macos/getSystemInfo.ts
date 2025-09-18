import { genericExecutor } from "./utils.js";

async function getCpu(): Promise<string> {
  return await genericExecutor("sysctl -n machdep.cpu.brand_string");
}

async function getMotherboard(): Promise<string> {
  const output = await genericExecutor("system_profiler SPHardwareDataType");
  const modelLine = output.split("\n").find(line => line.includes("Model Identifier"));
  return modelLine ? modelLine.split(":")[1].trim() : "Unknown";
}

async function getGpu(): Promise<string> {
  const output = await genericExecutor("system_profiler SPDisplaysDataType");
  const chipsetLine = output.split("\n").find(line => line.includes("Chipset Model"));
  return chipsetLine ? chipsetLine.split(":")[1].trim() : "Unknown";
}

export async function getSystemInfo(): Promise<{ cpu: string; motherboard: string; gpu: string; }> {
  const [cpu, motherboard, gpu] = await Promise.all([
    getCpu(),
    getMotherboard(),
    getGpu(),
  ]);

  return { cpu: cpu.trim(), motherboard, gpu };
}
