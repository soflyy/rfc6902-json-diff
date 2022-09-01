import { compare } from "../dist";
import { performance, PerformanceObserver } from "perf_hooks";
import { compare as fastJsonPatchCompare } from "fast-json-patch";
import { snapshots } from "./builder-data";
import { createPatch } from "rfc6902";
import { create, formatters } from "jsondiffpatch";

const observer = new PerformanceObserver((list) =>
  list.getEntries().forEach((entry) => console.info(entry))
);
observer.observe({ buffered: true, entryTypes: ["measure"] });

let i = 0;
for (const [left, right] of snapshots) {
  const leftParsed = JSON.parse(left);
  const rightParsed = JSON.parse(right);
  performance.mark(`start ${i}`);
  compare(leftParsed, rightParsed);
  performance.mark(`end ${i}`);

  performance.mark(`fast-json-patch start ${i}`);
  fastJsonPatchCompare(leftParsed, rightParsed);
  performance.mark(`fast-json-patch end ${i}`);

  performance.mark(`rfc6902 start ${i}`);
  createPatch(leftParsed, rightParsed);
  performance.mark(`rfc6902 end ${i}`);

  performance.mark(`jsondiffpatch start ${i}`);
  // @ts-ignore
  formatters.jsonpatch.format(
    create({
      arrays: { detectMove: false },
      objectHash: (obj: any) => JSON.stringify(obj),
    }).diff(leftParsed, rightParsed)
  );
  performance.mark(`jsondiffpatch end ${i}`);

  performance.measure(`rfc6902-json-diff ${i}`, `start ${i}`, `end ${i}`);
  performance.measure(
    `fast-json-patch ${i}`,
    `fast-json-patch start ${i}`,
    `fast-json-patch end ${i}`
  );
  performance.measure(`rfc6902 ${i}`, `rfc6902 start ${i}`, `rfc6902 end ${i}`);
  performance.measure(
    `jsondiffpatch ${i}`,
    `jsondiffpatch start ${i}`,
    `jsondiffpatch end ${i}`
  );

  i++;
}
