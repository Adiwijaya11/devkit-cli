#!/usr/bin/env node
import * as p from "@clack/prompts";
import { deteksiSemua } from "./core/detector.js";
import { jalankanBuatProyek } from "./commands/buat.js";
import { jalankanInstallTeknologi } from "./commands/install.js";
import { jalankanReferensiPerintah } from "./commands/referensi.js";
import { tampilkanWelcome } from "./core/welcome.js";
import { reset, bold, cyan, green, yellow, magenta, blue, warnaUntukTeknologi, teksBerwarna } from "./core/warna.js";

type OpsiMenu = "buat" | "install" | "cek" | "bantuan" | "keluar";

async function utama(): Promise<void> {
  await tampilkanWelcome();

  const opsi = await p.select({
    message: `${bold}${cyan}Apa yang ingin kamu lakukan?${reset}`,
    options: [
      { value: "buat", label: teksBerwarna("Buat Proyek Baru", green) },
      { value: "install", label: teksBerwarna("Install Teknologi", yellow) },
      { value: "cek", label: teksBerwarna("Cek Lingkungan", blue) },
      { value: "bantuan", label: teksBerwarna("Referensi Perintah", magenta) },
      { value: "keluar", label: teksBerwarna("Keluar", cyan) },
    ],
  });

  if (p.isCancel(opsi)) {
    p.cancel("Operasi dibatalkan.");
    process.exit(0);
  }

  switch (opsi as OpsiMenu) {
    case "buat":
      await jalankanBuatProyek();
      break;
    case "install":
      await jalankanInstallTeknologi();
      break;
    case "cek":
      await jalankanCekLingkungan();
      break;
    case "bantuan":
      await jalankanReferensiPerintah();
      break;
    case "keluar":
      p.outro("Sampai jumpa!");
      break;
  }
}

async function jalankanCekLingkungan(): Promise<void> {
  p.intro("Cek Lingkungan");

  const spinner = p.spinner();
  spinner.start("Memeriksa alat...");

  const hasil = await deteksiSemua();

  spinner.stop("Cek Lingkungan");

  const baris = hasil.map((r) => {
    const ikon = r.terinstall ? "✓" : "✗";
    const versi = r.terinstall ? r.versi : "Tidak terinstall";
    const warna = warnaUntukTeknologi(r.nama);
    return `${ikon} ${teksBerwarna(r.nama.padEnd(12), warna)} ${versi}`;
  });

  p.note(baris.join("\n"));

  p.outro("Pemeriksaan lingkungan selesai.");
}

utama();
