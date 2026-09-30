import * as p from "@clack/prompts";
import { dapatkanSemuaTeknologi } from "../core/registry.js";
import { deteksiSemua } from "../core/detector.js";
import { execute } from "../core/executor.js";
import type { DefinisiTeknologi } from "../types/index.js";
import { existsSync } from "node:fs";
import path from "node:path";
import { deteksiEnvironmentLokal, type EnvironmentLokal } from "../core/environment.js";
import { reset, bold, dim, green, yellow, cyan, warnaUntukTeknologi, teksBerwarna } from "../core/warna.js";

function validasiNamaProyek(nama: string | undefined): string | undefined {
  if (!nama?.trim()) {
    return "Nama proyek tidak boleh kosong.";
  }
  if (/[<>:"/\\|?*]/.test(nama)) {
    return "Nama proyek mengandung karakter yang tidak valid.";
  }
  if (nama.startsWith(".") || nama.startsWith("-")) {
    return "Nama proyek tidak boleh dimulai dengan titik atau strip.";
  }
  return undefined;
}

async function pilihVersiLaravel(): Promise<string | symbol> {
  const versi = await p.select({
    message: "Pilih versi Laravel:",
    options: [
      { value: "latest", label: "Latest", hint: "Versi terbaru" },
      { value: "12.*", label: "Laravel 12", hint: "PHP 8.2+" },
      { value: "11.*", label: "Laravel 11", hint: "PHP 8.2+" },
      { value: "10.*", label: "Laravel 10", hint: "PHP 8.1+" },
      { value: "9.*", label: "Laravel 9", hint: "PHP 8.0+" },
      { value: "8.*", label: "Laravel 8", hint: "PHP 7.4+" },
    ],
  });

  return versi;
}

async function pilihLokasiLaravel(): Promise<string | symbol> {
  const environments = await deteksiEnvironmentLokal();

  const options = environments
    .filter((e) => e.terdeteksi)
    .map((e) => ({
      value: e.path,
      label: `${e.nama} — ${e.path}`,
      hint: e.sumber,
    }));

  options.push({
    value: "custom",
    label: "Lokasi lain...",
    hint: "Pilih folder tujuan sendiri",
  });

  const lokasi = await p.select({
    message: "Simpan proyek di mana?",
    options,
  });

  if (p.isCancel(lokasi)) {
    return lokasi;
  }

  if (lokasi === "custom") {
    const pathCustom = await p.text({
      message: "Masukkan path folder tujuan:",
      placeholder: "C:\\xampp\\htdocs",
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

  return lokasi;
}

async function cekRequirements(requirements: string[]): Promise<boolean> {
  const hasil = await deteksiSemua();
  const alatMap = new Map(hasil.map((r) => [r.nama.toLowerCase(), r]));

  const semuaTerpenuhi = requirements.every((req) => {
    const alat = alatMap.get(req.toLowerCase());
    return alat?.terinstall ?? false;
  });

  if (!semuaTerpenuhi) {
    const hilang = requirements.filter((req) => {
      const alat = alatMap.get(req.toLowerCase());
      return !alat?.terinstall;
    });
    p.note(`Requirements tidak terpenuhi: ${hilang.join(", ")}`);
    return false;
  }

  return true;
}

export async function jalankanBuatProyek(): Promise<void> {
  p.intro("Buat Proyek Baru");

  const daftarTeknologi = dapatkanSemuaTeknologi();

  const teknologiDipilih = await p.select({
    message: "Apa yang ingin kamu buat?",
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

  const teknologi = daftarTeknologi.find(
    (t) => t.nama === teknologiDipilih
  ) as DefinisiTeknologi;

  let versiLaravel: string | null = null;

  if (teknologi.nama.toLowerCase() === "laravel") {
    const versi = await pilihVersiLaravel();

    if (p.isCancel(versi)) {
      p.cancel("Operasi dibatalkan.");
      return;
    }

    versiLaravel = versi as string;
  }

  const namaProyek = await p.text({
    message: "Nama proyek:",
    placeholder: "my-app",
    validate: validasiNamaProyek,
  });

  if (p.isCancel(namaProyek)) {
    p.cancel("Operasi dibatalkan.");
    return;
  }

  if (typeof namaProyek !== "string") {
    p.cancel("Operasi dibatalkan.");
    return;
  }

  const spinner = p.spinner();
  spinner.start("Memeriksa requirements...");

  const requirementsOk = await cekRequirements(teknologi.requirements);

  if (!requirementsOk) {
    spinner.stop("Requirements tidak terpenuhi");
    p.outro("Silakan install requirements yang hilang terlebih dahulu.");
    return;
  }

  spinner.stop("Requirements terpenuhi");

  let cwdProyek = namaProyek;
  let labelLokasi = namaProyek;

  if (teknologi.nama.toLowerCase() === "laravel") {
    const lokasi = await pilihLokasiLaravel();

    if (p.isCancel(lokasi)) {
      p.cancel("Operasi dibatalkan.");
      return;
    }

    const lokasiResolved = lokasi as string;

    if (!existsSync(lokasiResolved)) {
      p.note(`Folder ${lokasiResolved} tidak ada. Folder akan dibuat otomatis.`, "Info");
    }

    cwdProyek = path.join(lokasiResolved, namaProyek);
    labelLokasi = cwdProyek;
  }

  const warnaTeknologi = warnaUntukTeknologi(teknologi.nama);

  const langkah = [
    `Buat proyek ${teksBerwarna(teknologi.nama, warnaTeknologi)}${versiLaravel ? ` ${versiLaravel}` : ""}`,
    ...(teknologi.perintahInstall.length > 0 ? ["Install dependencies"] : []),
    "Verifikasi instalasi",
  ];

  const rencana = [
    `Proyek: ${bold}${namaProyek}${reset}`,
    `Teknologi: ${teksBerwarna(teknologi.nama, warnaTeknologi)}`,
    ...(versiLaravel ? [`Versi: ${versiLaravel}`] : []),
    `Lokasi: ${labelLokasi}`,
    ``,
    `Langkah:`,
    ...langkah.map((l, i) => `  ${i + 1}. ${l}`),
  ].join("\n");

  p.note(rencana, "Rencana Proyek");

  const konfirmasi = await p.confirm({
    message: "Lanjutkan?",
    initialValue: true,
  });

  if (p.isCancel(konfirmasi) || !konfirmasi) {
    p.cancel("Operasi dibatalkan.");
    return;
  }

  const spinnerEksekusi = p.spinner();

  const argsBuat = versiLaravel && versiLaravel !== "latest"
    ? [...teknologi.perintahBuat.slice(1), namaProyek, versiLaravel]
    : [...teknologi.perintahBuat.slice(1), namaProyek];

  const perintahBuat = teknologi.perintahBuat[0];
  if (!perintahBuat) {
    p.outro("Perintah buat tidak ditemukan.");
    return;
  }

  spinnerEksekusi.start(`Membuat proyek ${teknologi.nama}...`);
  const hasilBuat = await execute(
    perintahBuat,
    argsBuat,
    teknologi.nama.toLowerCase() === "laravel"
      ? { cwd: path.dirname(cwdProyek) }
      : {}
  );

  if (!hasilBuat.success) {
    spinnerEksekusi.stop("Gagal membuat proyek");
    p.note(hasilBuat.stderr, "Error");
    p.outro("Pembuatan proyek gagal.");
    return;
  }
  spinnerEksekusi.stop("Proyek berhasil dibuat");

  if (teknologi.perintahInstall.length > 0) {
    const perintahInstall = teknologi.perintahInstall[0];
    if (!perintahInstall) {
      p.outro("Perintah install tidak ditemukan.");
      return;
    }

    spinnerEksekusi.start("Menginstall dependencies...");
    const hasilInstall = await execute(perintahInstall, teknologi.perintahInstall.slice(1), { cwd: cwdProyek });

    if (!hasilInstall.success) {
      spinnerEksekusi.stop("Gagal menginstall dependencies");
      p.note(hasilInstall.stderr, "Error");
      p.outro("Instalasi dependencies gagal.");
      return;
    }
    spinnerEksekusi.stop("Dependencies berhasil diinstall");
  }

  const perintahVerifikasi = teknologi.perintahVerifikasi[0];
  if (!perintahVerifikasi) {
    p.outro("Perintah verifikasi tidak ditemukan.");
    return;
  }

  spinnerEksekusi.start("Memverifikasi instalasi...");
  const hasilVerifikasi = await execute(perintahVerifikasi, teknologi.perintahVerifikasi.slice(1), { cwd: cwdProyek });

  if (!hasilVerifikasi.success) {
    spinnerEksekusi.stop("Verifikasi gagal");
    p.note(hasilVerifikasi.stderr, "Error");
    p.outro("Verifikasi instalasi gagal.");
    return;
  }
  spinnerEksekusi.stop("Verifikasi berhasil");

  p.outro(`Proyek ${teksBerwarna(namaProyek, warnaTeknologi)} berhasil dibuat di ${labelLokasi}!`);
}
