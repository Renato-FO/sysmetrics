import { genericExecutor } from "./utils.js";

interface Process {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
}

export async function getTopProcesses(options: { limit?: number; sortBy?: 'cpu' | 'memory' }): Promise<Process[]> {
  const limit = options.limit || 10;
  const sortBy = options.sortBy || 'cpu';

  const sortKey = sortBy === 'cpu' ? '-pcpu' : '-pmem';

  const command = `ps -eo pid,pcpu,pmem,comm --sort=${sortKey} | head -n ${limit + 1}`;

  const output = await genericExecutor(command);
  const lines = output.trim().split('\n').slice(1);

  return lines.map(line => {
    const parts = line.trim().split(/\s+/);
    const [pid, cpu, memory, ...nameParts] = parts;
    const name = nameParts.join(' ');

    return {
      pid: parseInt(pid, 10),
      name,
      cpu: parseFloat(cpu),
      memory: parseFloat(memory),
    };
  });
}
