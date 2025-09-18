import { genericExecutor, getNumberOfCores } from "./utils.js";

export interface Process {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  processCount?: number;
}

export async function getTopProcesses(
  options: { limit?: number; sortBy?: "cpu" | "memory" } = {}
): Promise<Process[]> {
  const { limit = 5, sortBy = "cpu" } = options;
  const numberOfCores = await getNumberOfCores();
  const command =
    "wmic path Win32_PerfFormattedData_PerfProc_Process get Name,IDProcess,PercentProcessorTime,WorkingSet /format:csv";

  const stdout = await genericExecutor(command);

  const lines = stdout.trim().split("\r\n");
  if (lines.length < 2) {
    return [];
  }

  const processMap = new Map<string, Process>();

  lines.slice(1).forEach((line) => {
    const parts = line.split(",");
    if (parts.length < 5) return;

    const rawName = parts[2];
    const cleanName = rawName.split("#")[0];

    if (cleanName === "Idle" || cleanName === "_Total") return;

    const rawCpu = parseInt(parts[3], 10);
    const memoryBytes = parseInt(parts[4], 10);

    const currentProcess: Process = {
      name: cleanName,
      pid: parseInt(parts[1], 10),
      cpu: parseFloat((rawCpu / numberOfCores).toFixed(2)),
      memory: Math.round(memoryBytes / (1024 * 1024)),
      processCount: 1,
    };

    if (processMap.has(cleanName)) {
      const existing = processMap.get(cleanName)!;
      existing.cpu += currentProcess.cpu;
      existing.memory += currentProcess.memory;
      existing.processCount = (existing.processCount || 1) + 1;
    } else {
      processMap.set(cleanName, currentProcess);
    }
  });

  const groupedProcesses = Array.from(processMap.values());

  groupedProcesses.sort((a, b) => {
    if (sortBy === "cpu") {
      return b.cpu - a.cpu;
    } else {
      return b.memory - a.memory;
    }
  });

  return groupedProcesses.slice(0, limit);
}
