import { windows } from "./commands/windows/index.js";
import { linux } from "./commands/linux/index.js";
import { macos } from "./commands/macos/index.js";
import * as os from "os";

function getMetricsForPlatform() {
  const platform = os.platform();

  switch (platform) {
    case "win32":
      return windows;
    case "linux":
      return linux;
    case "darwin":
      return macos;
    default:
      throw new Error(`Unsupported operating system: ${platform}`);
  }
}

export const sysmetrics = getMetricsForPlatform();
