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

export const genericExecutor = executeCommand;
