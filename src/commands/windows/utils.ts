import { exec } from "child_process";

function executeCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error || stderr) {
        return reject(error || new Error(stderr));
      }
      resolve(stdout);
    });
  });
}

export async function executeWmicQuery(command: string): Promise<number> {
  const stdout = await executeCommand(command);
  const lines = stdout.trim().split("\n");
  if (lines.length < 2) {
    throw new Error("Unexpected output from wmic command, expected a number.");
  }
  const value = parseInt(lines[1].trim(), 10);
  if (isNaN(value)) {
    throw new Error("Could not parse numeric value from wmic output.");
  }
  return value;
}

export async function executeWmicStringQuery(command: string): Promise<string> {
  const stdout = await executeCommand(command);
  const lines = stdout.trim().split("\n");
  if (lines.length < 2) {
    throw new Error("Unexpected output from wmic command, expected a string.");
  }
  return lines[1].trim();
}

let coreCount: number | null = null;
export async function getNumberOfCores(): Promise<number> {
  if (coreCount !== null) {
    return coreCount;
  }
  const cores = await executeWmicQuery(
    "wmic cpu get NumberOfLogicalProcessors"
  );
  coreCount = cores;
  return cores;
}

export const genericExecutor = executeCommand;
