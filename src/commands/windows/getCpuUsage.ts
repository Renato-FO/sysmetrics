import { executeWmicQuery } from "./utils.js";

export function getCpuUsage(): Promise<number> {
  return executeWmicQuery("wmic cpu get loadpercentage");
}
