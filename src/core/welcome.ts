import * as p from "@clack/prompts";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { reset, bold, dim, yellow, cyan, white, warnaUntukTeknologi, teksBerwarna } from "./warna.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = JSON.parse(readFileSync(path.join(__dirname, "../../package.json"), "utf-8"));
const VERSI = pkg.version;

function center(text: string, width: number): string {
  const lines = text.split("\n");
  return lines
    .map((line) => {
      const visibleLength = line.replace(/\x1b\[[0-9;]*m/g, "").length;
      const padding = Math.max(0, Math.floor((width - visibleLength) / 2));
      return " ".repeat(padding) + line;
    })
    .join("\n");
}

export async function tampilkanWelcome(): Promise<void> {
  process.stdout.write("\x1Bc");

  const termWidth = process.stdout.columns || 80;

  const logo = [
    `${bold}${cyan}  ██████╗ ███████╗██╗   ██╗██╗  ██╗██╗████████╗${reset}`,
    `${bold}${cyan}  ██╔══██╗██╔════╝██║   ██║██║ ██╔╝██║╚══██╔══╝${reset}`,
    `${bold}${cyan}  ██║  ██║█████╗  ██║   ██║█████╔╝ ██║   ██║   ${reset}`,
    `${bold}${cyan}  ██║  ██║██╔══╝  ╚██╗ ██╔╝██╔═██╗ ██║   ██║   ${reset}`,
    `${bold}${cyan}  ██████╔╝███████╗ ╚████╔╝ ██║  ██╗██║   ██║   ${reset}`,
    `${bold}${cyan}  ╚═════╝ ╚══════╝  ╚═══╝  ╚═╝  ╚═╝╚═╝   ╚═╝   ${reset}`,
  ].join("\n");

  console.log(center(logo, termWidth));
  console.log();

  const title = `${bold}${white}  DEVKIT${reset} ${dim}— Developer Project Wizard${reset}`;
  console.log(center(title, termWidth));
  console.log();

  const info = [
    `${bold}${cyan}  Versi:${reset} ${VERSI}`,
    `${bold}${cyan}  Node:${reset} ${process.version}`,
    `${bold}${cyan}  Platform:${reset} ${process.platform}`,
  ];

  console.log(center(info.join("  "), termWidth));
  console.log();

  const pembuat = `${bold}${yellow}  Dibuat oleh:${reset} ${cyan}@Adiwijaya11${reset}`;
  console.log(center(pembuat, termWidth));
  console.log();

  await p.note(
    `${bold}Selamat datang di DevKit!${reset}\n\nDevKit akan membantu kamu membuat project, menginstall teknologi, dan mengecek environment tanpa perlu menghafal command.`,
    "Welcome"
  );

  console.log();
}
