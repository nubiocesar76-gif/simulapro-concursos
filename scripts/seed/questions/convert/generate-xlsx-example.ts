/**
 * Gera docs/imports/questions.xlsx a partir de docs/imports/questions.csv
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import * as XLSX from "xlsx";
import { projectRoot } from "../../core/env.ts";

const root = projectRoot();
const csvPath = resolve(root, "docs/imports/questions.csv");
const xlsxPath = resolve(root, "docs/imports/questions.xlsx");

const csvText = readFileSync(csvPath, "utf8");
const workbook = XLSX.read(csvText, { type: "string" });
writeFileSync(xlsxPath, XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
console.log(`Gerado: ${xlsxPath}`);
