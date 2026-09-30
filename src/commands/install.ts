import * as p from "@clack/prompts";
import { existsSync, readFileSync } from "node:fs";
import { dapatkanSemuaTeknologi } from "../core/registry.js";
import { execute } from "../core/executor.js";
import type { DefinisiTeknologi } from "../types/index.js";
import { jalankanBuatProyek } from "./buat.js";
import { reset, bold, dim, green, yellow, cyan, warnaUntukTeknologi, teksBerwarna } from "../core/warna.js";

interface InfoProject {
  jenis: string;
  dependencies?: string[];
}

function deteksiProjectDetail(): InfoProject[] {
  const hasil: InfoProject[] = [];

  if (existsSync("package.json")) {
    try {
      const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      const depList = Object.keys(deps);

      hasil.push({
        jenis: "Node.js",
        dependencies: depList,
      });

      if (existsSync("vite.config.ts") || existsSync("vite.config.js")) {
        hasil.push({ jenis: "Vite" });
      }
      if (depList.includes("react")) {
        hasil.push({ jenis: "React" });
      }
      if (depList.some((d) => d.includes("tailwindcss"))) {
        hasil.push({ jenis: "Tailwind CSS" });
      }
    } catch {
      hasil.push({ jenis: "Node.js" });
    }
  }

  if (existsSync("composer.json")) {
    hasil.push({ jenis: "Laravel" });
  }

  if (hasil.length === 0) {
    hasil.push({ jenis: "Tidak dikenali" });
  }

  return hasil;
}

function deteksiOS(): string {
  const platform = process.platform;
  if (platform === "win32") return "windows";
  if (platform === "darwin") return "macos";
  return "linux";
}

async function installDiProjectYangAda(): Promise<void> {
  const os = deteksiOS();
  const projectDetail = deteksiProjectDetail();

  const infoProject = projectDetail
    .filter((p) => p.jenis !== "Tidak dikenali")
    .map((p) => p.jenis);

  if (infoProject.length === 0) {
    p.note(
      "Tidak ada project terdeteksi di directory ini. Pastikan kamu berada di folder project.",
      "Project Saat Ini"
    );
    p.outro("Install teknologi membutuhkan project yang sudah ada.");
    return;
  }

  p.note(
    [
      `Project terdeteksi: ${infoProject.join(", ")}`,
      ...(projectDetail[0]?.dependencies
        ? [`Dependencies: ${projectDetail[0].dependencies.slice(0, 5).join(", ")}${projectDetail[0].dependencies.length > 5 ? "..." : ""}`]
        : []),
    ].join("\n"),
    "Project Saat Ini"
  );

  const daftarTeknologi = dapatkanSemuaTeknologi().filter(
    (t) => t.perintahInstall.length > 0
  );

  const teknologiDipilih = await p.select({
    message: "Apa yang ingin kamu install?",
    options: daftarTeknologi.map((t) => ({
      value: t.nama,
      label: teksBerwarna(t.nama, warnaUntukTeknologi(t.nama)),
      hint: t.deskripsi,
    })),
  });

  if (p.isCancel(teknologiDipilih)) {
    p.cancel("Operasi dibatalkan.");
    return;
  }

  if (typeof teknologiDipilih !== "string") {
    p.cancel("Operasi dibatalkan.");
    return;
  }

  const teknologi = daftarTeknologi.find(
    (t) => t.nama === teknologiDipilih
  ) as DefinisiTeknologi;

  const warnaTeknologi = warnaUntukTeknologi(teknologi.nama);
  const perintahLengkap = `${teknologi.perintahInstall.join(" ")}`;

  p.note(
    [
      `Teknologi: ${teksBerwarna(teknologi.nama, warnaTeknologi)}`,
      `Deskripsi: ${teknologi.deskripsi}`,
      `OS: ${os}`,
      ``,
      `Perintah: ${perintahLengkap}`,
    ].join("\n"),
    "Rencana Install"
  );

  const konfirmasi = await p.confirm({
    message: "Lanjutkan?",
    initialValue: true,
  });

  if (p.isCancel(konfirmasi) || !konfirmasi) {
    p.cancel("Operasi dibatalkan.");
    return;
  }

  const perintahInstall = teknologi.perintahInstall[0];
  if (!perintahInstall) {
    p.outro("Perintah install tidak ditemukan.");
    return;
  }

  const perintahVerifikasi = teknologi.perintahVerifikasi[0];
  if (!perintahVerifikasi) {
    p.outro("Perintah verifikasi tidak ditemukan.");
    return;
  }

  const spinner = p.spinner();

  spinner.start(`Menginstall ${teknologi.nama}...`);
  const hasilInstall = await execute(
    perintahInstall,
    teknologi.perintahInstall.slice(1),
    { shell: true }
  );

  if (!hasilInstall.success) {
    spinner.stop("Gagal menginstall");

    p.note(
      `Auto-install gagal. Berikut panduan manual untuk install ${teknologi.nama}:`,
      "Panduan Install"
    );

    if (teknologi.panduanManual) {
      p.note(teknologi.panduanManual, "Langkah Manual");
    }

    p.outro("Silakan install manual terlebih dahulu.");
    return;
  }
  spinner.stop(`${teknologi.nama} berhasil diinstall`);

  spinner.start("Memverifikasi instalasi...");
  const hasilVerifikasi = await execute(
    perintahVerifikasi,
    teknologi.perintahVerifikasi.slice(1)
  );

  if (!hasilVerifikasi.success) {
    spinner.stop("Verifikasi gagal");
    p.note(hasilVerifikasi.stderr, "Error");
    p.outro("Verifikasi instalasi gagal.");
    return;
  }
  spinner.stop("Verifikasi berhasil");

  p.outro(`${teknologi.nama} berhasil diinstall!`);
}

export async function jalankanInstallTeknologi(): Promise<void> {
  p.intro("Install Teknologi");

  const opsi = await p.select({
    message: "Apa yang ingin kamu lakukan?",
    options: [
      {
        value: "existing",
        label: "Install di project yang sudah ada",
        hint: "Install teknologi ke project yang sudah ada di folder ini",
      },
      {
        value: "new",
        label: "Buat project baru dulu",
        hint: "Buat project baru, lalu install teknologi",
      },
    ],
  });

  if (p.isCancel(opsi)) {
    p.cancel("Operasi dibatalkan.");
    return;
  }

  if (opsi === "new") {
    await jalankanBuatProyek();
    return;
  }

  await installDiProjectYangAda();
}
