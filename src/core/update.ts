import { execa } from "execa";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { bold, cyan, green, yellow, reset } from "./warna.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = JSON.parse(readFileSync(path.join(__dirname, "../../package.json"), "utf-8"));
const VERSI_LOKAL = pkg.version;

export async function cekUpdate(): Promise<{ adaUpdate: boolean; versiTerbaru: string }> {
  try {
    const hasil = await execa("npm", ["view", "devkit-tool", "version"], { timeout: 10000 });
    const versiTerbaru = hasil.stdout.trim();

    return {
      adaUpdate: versiTerbaru !== VERSI_LOKAL,
      versiTerbaru,
    };
  } catch {
    return { adaUpdate: false, versiTerbaru: VERSI_LOKAL };
  }
}

export async function tampilkanUpdate(): Promise<void> {
  const { adaUpdate, versiTerbaru } = await cekUpdate();

  if (!adaUpdate) {
    return;
  }

  const p = await import("@clack/prompts");

  const pilihan = await p.select({
    message: `${bold}${yellow}Tersedia update versi ${versiTerbaru}!${reset}`,
    options: [
      {
        value: "update",
        label: `${green}Update sekarang${reset}`,
        hint: `Install versi ${versiTerbaru}`,
      },
      {
        value: "skip",
        label: `${cyan}Lewati${reset}`,
        hint: "Lanjut ke DevKit",
      },
    ],
  });

  if (p.isCancel(pilihan) || pilihan === "skip") {
    return;
  }

  const spinner = p.spinner();
  spinner.start("Mengupdate devkit-tool...");

  try {
    await execa("npm", ["install", "-g", "devkit-tool@latest"], { timeout: 120000 });
    spinner.stop("Update berhasil!");
    p.outro("Silakan jalankan ulang `devkit` untuk menggunakan versi terbaru.");
    process.exit(0);
  } catch {
    spinner.stop("Update gagal");
    p.note("Silakan update manual: npm install -g devkit-tool@latest", "Error");
  }
}
