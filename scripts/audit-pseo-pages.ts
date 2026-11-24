import { getAllHookPages } from "../lib/pseo/data";
import { failingChecks } from "../lib/pseo/quality";

const pages = getAllHookPages();

console.log("| slug | score | failing checks |");
console.log("| --- | ---: | --- |");
for (const page of pages) {
  const failing = failingChecks(page);
  console.log(
    `| /hooks/${page.platformSlug}/${page.hookTypeSlug} | ${page.qualityScore} | ${failing.length ? failing.join(", ") : "none"} |`,
  );
}
