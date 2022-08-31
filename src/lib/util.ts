import { trim } from "lodash";

export function escapePathComponent(path: string): string {
  return trim(path, "/");
  // if (path.indexOf("/") === -1 && path.indexOf("~") === -1) return path;
  // return path.replace(/~/g, "~0").replace(/\//g, "~1");
}
export const joinPathWith = (path: string, key: number | string) =>
  `${path}/${escapePathComponent(String(key))}`;
