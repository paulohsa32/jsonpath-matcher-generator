#!/usr/bin/env node
import { defineCommand, runMain } from "citty";
import destr from "destr";
import { readFile, rm, writeFile } from "node:fs/promises";
import { version } from "../package.json";
import { useJsonPath } from "./composables/useJsonPath";

const main = defineCommand<{}>({
  meta: {
    name: "jpth",
    description: "JSON to JSONPath converter",
    version,
  },
  args: {
    path: {
      type: "positional",
      default: "",
      description: "Path to the file you want to use as base for the JSONPath",
      required: false,
    },
    output: {
      type: "string",
      description: "Path to the desired output file",
      required: false,
      alias: ["o"],
    },
  },
  async setup({ args }) {
    const rawSample = await readFile(String(args.path), "utf8");
    const sample = destr(rawSample);

    if (args.output && typeof args.output === "string") {
      try {
        await rm(args.output, { force: true });
        await writeFile(args.output, useJsonPath(sample));

        console.log(`JsonPath written on file ${args.output} successfully!`);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    } else {
      console.log(useJsonPath(sample));
    }
  },
});

runMain(main);
