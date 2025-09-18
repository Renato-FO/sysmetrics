import { sysmetrics } from "./index.js";
import type { Process } from "./commands/windows/getTopProcesses.js";

function printProcessesTable(title: string, processes: Process[]): void {
  console.log(`\n--- ${title} ---`);
  console.log(
    "Name".padEnd(30),
    "PID".padEnd(10),
    "CPU".padEnd(10),
    "Memory (MB)"
  );
  processes.forEach((p) => {
    const cpu = p.cpu !== null ? p.cpu.toFixed(2) : "N/A";
    const memory = p.memory.toFixed(0);
    console.log(
      p.name.padEnd(30),
      p.pid.toString().padEnd(10),
      cpu.padEnd(10),
      memory
    );
  });
}

async function runTest() {
  try {
    const cpu = await sysmetrics.getCpuUsage();
    const systemInfo = await sysmetrics.getSystemInfo();
    const ram = await sysmetrics.getMemoryUsage();

    console.log(`\nSystem Information:`);
    console.log(`  - CPU Info: ${systemInfo.cpu}`);
    console.log(`  - Motherboard: ${systemInfo.motherboard}`);
    console.log(`  - GPU: ${systemInfo.gpu}`);

    console.log(`\nCPU Information:`);
    console.log(`  - Used Percentage: ${cpu}%`);

    console.log(`\nGPU Information:`);
    console.log(
      `  - VRAM Total: ${
        (await sysmetrics.getGpuInfo().getCurrentGpuStats()).memoryTotal
      } MB`
    );
    console.log(
      `  - VRAM Used: ${
        (await sysmetrics.getGpuInfo().getCurrentGpuStats()).vramUsed
      } MB`
    );
    console.log(
      `  - Memory Percentage: ${
        (await sysmetrics.getGpuInfo().getCurrentGpuStats()).memoryUsed
      } %`
    );
    console.log(
      `  - Temperature: ${
        (await sysmetrics.getGpuInfo().getCurrentGpuStats()).temperature
      } °C`
    );

    console.log(`\nRAM Information:`);
    console.log(`  - Memory Total: ${ram.total} MB`);
    console.log(`  - Memory Free: ${ram.free} MB`);
    console.log(`  - Memory Used: ${ram.used} MB`);

    const topCpuProcesses = await sysmetrics.getTopProcesses({
      sortBy: "cpu",
      limit: 5,
    });
    printProcessesTable("Top 5 Processes by CPU", topCpuProcesses);

    const topMemoryProcesses = await sysmetrics.getTopProcesses({
      sortBy: "memory",
      limit: 5,
    });
    printProcessesTable("Top 5 Processes by Memory", topMemoryProcesses);
  } catch (error) {
    console.error("\n[ERROR] Failed to fetch metrics:", error);
  }
}

runTest();
