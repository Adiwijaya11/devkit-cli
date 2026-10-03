import * as p from "@clack/prompts";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { dapatkanSemuaTeknologi } from "../core/registry.js";
import { execute } from "../core/executor.js";
import type { DefinisiTeknologi } from "../types/index.js";
import { jalankanBuatProyek } from "./buat.js";
import { deteksiEnvironmentLokal } from "../core/environment.js";
import { reset, bold, dim, green, yellow, cyan, warnaUntukTeknologi, teksBerwarna } from "../core/warna.js";

interface InfoProject {
  jenis: string;
  dependencies?: string[];
}

function deteksiProjectDetail(cwd: string = "."): InfoProject[] {
  const hasil: InfoProject[] = [];

  if (existsSync(path.join(cwd, "package.json"))) {
    try {
      const pkg = JSON.parse(readFileSync(path.join(cwd, "package.json"), "utf-8"));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      const depList = Object.keys(deps);

      hasil.push({
        jenis: "Node.js",
        dependencies: depList,
      });

      if (existsSync(path.join(cwd, "vite.config.ts")) || existsSync(path.join(cwd, "vite.config.js"))) {
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

  if (existsSync(path.join(cwd, "composer.json"))) {
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

function daftarProjectDiFolder(folderPath: string): string[] {
  try {
    return readdirSync(folderPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((name) => !name.startsWith("."));
  } catch {
    return [];
  }
}

async function pilihFolderProject(): Promise<string | symbol> {
  const environments = await deteksiEnvironmentLokal();
  const wwwFolders = environments.filter((e) => e.terdeteksi && e.path.includes("www"));

  const options: Array<{ value: string; label: string; hint: string }> = [];

  if (wwwFolders.length > 0) {
    for (const folder of wwwFolders) {
      const projects = daftarProjectDiFolder(folder.path);
      if (projects.length > 0) {
        for (const project of projects) {
          options.push({
            value: path.join(folder.path, project),
            label: `${project} — ${folder.path}`,
            hint: `${folder.nama}`,
          });
        }
      } else {
        options.push({
          value: folder.path,
          label: `${folder.nama} — ${folder.path}`,
          hint: "Folder kosong",
        });
      }
    }
  }

  options.push({
    value: "current",
    label: "Folder saat ini",
    hint: process.cwd(),
  });

  options.push({
    value: "custom",
    label: "Input lokasi folder manual",
    hint: "Masukkan path folder sendiri",
  });

  const folder = await p.select({
    message: "Pilih folder project:",
    options,
  });

  if (p.isCancel(folder)) {
    return folder;
  }

  if (folder === "current") {
    return process.cwd();
  }

  if (folder === "custom") {
    const pathCustom = await p.text({
      message: "Masukkan path folder project:",
      placeholder: "C:\\laragon\\www\\my-project",
      validate: (value: string | undefined) => {
        if (!value?.trim()) {
          return "Path tidak boleh kosong.";
        }
        return undefined;
      },
    });

    if (p.isCancel(pathCustom)) {
      return pathCustom;
    }

    return pathCustom;
  }

  return folder;
}

async function installDiProjectYangAda(): Promise<void> {
  const os = deteksiOS();

  const folderProject = await pilihFolderProject();

  if (p.isCancel(folderProject)) {
    p.cancel("Operasi dibatalkan.");
    return;
  }

  if (typeof folderProject !== "string") {
    p.cancel("Operasi dibatalkan.");
    return;
  }

  if (!existsSync(folderProject)) {
    p.note(`Folder ${folderProject} tidak ditemukan.`, "Error");
    p.outro("Silakan cek lokasi folder project.");
    return;
  }

  const projectDetail = deteksiProjectDetail(folderProject);

  const infoProject = projectDetail
    .filter((p) => p.jenis !== "Tidak dikenali")
    .map((p) => p.jenis);

  if (infoProject.length === 0) {
    p.note(
      "Tidak ada project terdeteksi di folder ini. Pastikan folder berisi project yang valid.",
      "Project Saat Ini"
    );
    p.outro("Install teknologi membutuhkan project yang sudah ada.");
    return;
  }

  p.note(
    [
      `Folder: ${folderProject}`,
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
      `Folder: ${folderProject}`,
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
    { cwd: folderProject }
  );

  if (!hasilInstall.success) {
    spinner.stop("Gagal menginstall");

    p.note(
      `Auto-install gagal. Error: ${hasilInstall.stderr || hasilInstall.stdout}`,
      "Error"
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
    teknologi.perintahVerifikasi.slice(1),
    { cwd: folderProject }
  );

  if (!hasilVerifikasi.success) {
    spinner.stop("Verifikasi gagal");
    p.note(hasilVerifikasi.stderr, "Error");
    p.outro("Verifikasi instalasi gagal.");
    return;
  }
  spinner.stop("Verifikasi berhasil");

  p.outro(`${teknologi.nama} berhasil diinstall di ${folderProject}!`);
}

export async function jalankanInstallTeknologi(): Promise<void> {
  p.intro("Install Teknologi");

  const opsi = await p.select({
    message: "Apa yang ingin kamu lakukan?",
    options: [
      {
        value: "existing",
        label: "Install di project yang sudah ada",
        hint: "Install teknologi ke project yang sudah ada",
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
