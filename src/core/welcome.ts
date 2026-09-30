import * as p from "@clack/prompts";
import { reset, bold, dim, yellow, cyan, white, warnaUntukTeknologi, teksBerwarna } from "./warna.js";

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
    `${bold}${cyan}  Versi:${reset} 1.0.0`,
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
