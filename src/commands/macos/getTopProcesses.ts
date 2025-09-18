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

  const sortKey = sortBy === 'cpu' ? '-cpu' : '-mem';

  const command = `top -l 1 -o ${sortKey} -n ${limit} | tail -n ${limit}`;

  const output = await genericExecutor(command);
  const lines = output.trim().split('\n');

  return lines.map(line => {
    const parts = line.trim().split(/\s+/);
    const [pid, name, cpu, , memory] = parts;

    return {
      pid: parseInt(pid, 10),
      name,
      cpu: parseFloat(cpu),
      memory: parseFloat(memory.replace('M', '')),
    };
  });
}
