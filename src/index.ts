import { compare } from "./lib/diff";
import { left, right } from "./data";
import { performance, PerformanceObserver } from "perf_hooks";

export * from "./types";
export * from "./lib/diff";

const observer = new PerformanceObserver((list) =>
  list.getEntries().forEach((entry) => console.info(entry))
);
observer.observe({ buffered: true, entryTypes: ["measure"] });

performance.mark("start");

const result = compare(left, right);

performance.mark("end");

performance.measure("DIFF", "start", "end");

console.log(result);
