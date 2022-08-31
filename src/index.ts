import { compare } from "./lib/diff";
import { performance, PerformanceObserver } from "perf_hooks";

export * from "./types";
export * from "./lib/diff";

import { snapshots } from "./benchmark/builder-data";

const observer = new PerformanceObserver((list) =>
  list.getEntries().forEach((entry) => console.info(entry))
);
observer.observe({ buffered: true, entryTypes: ["measure"] });

// showMem();

for (const [left, right] of snapshots) {
  const leftParsed = JSON.parse(left);
  const rightParsed = JSON.parse(right);
  performance.mark("start");
  const result = compare(leftParsed, rightParsed);
  performance.mark("end");

  console.log(result);
}
// showMem();
// const result = compare(left, right);

performance.measure("DIFF", "start", "end");
