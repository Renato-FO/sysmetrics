import { genericExecutor } from "./utils.js";

async function getCpu(): Promise<string> {
  const output = await genericExecutor("cat /proc/cpuinfo");
  const modelNameLine = output.split("\n").find(line => line.startsWith("model name"));
  return modelNameLine ? modelNameLine.split(":")[1].trim() : "Unknown";
}

async function getMotherboard(): Promise<string> {
  try {
    const vendor = await genericExecutor("cat /sys/devices/virtual/dmi/id/board_vendor");
    const name = await genericExecutor("cat /sys/devices/virtual/dmi/id/board_name");
    return `${vendor.trim()} ${name.trim()}`;
  } catch (error) {
    return "Unknown";
  }
}

async function getGpu(): Promise<string> {
  try {
    const output = await genericExecutor("lspci | grep -i vga");
    const match = output.match(/controller: (.*)/);
    return match ? match[1].trim() : "Unknown";
  } catch (error) {
    return "Unknown";
  }
}

export async function getSystemInfo(): Promise<{ cpu: string; motherboard: string; gpu: string; }> {
  const [cpu, motherboard, gpu] = await Promise.all([
    getCpu(),
    getMotherboard(),
    getGpu(),
  ]);

  return { cpu, motherboard, gpu };
}
