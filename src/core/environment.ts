import { execa } from "execa";
import { existsSync } from "node:fs";

export interface EnvironmentLokal {
  nama: string;
  path: string;
  terdeteksi: boolean;
  sumber: string;
}

const drives = ["C:", "D:", "E:", "F:"];

const pathLaragon = ["laragon\\www", "laragon64\\www"];
const pathXampp = ["xampp\\htdocs", "xampp8\\htdocs", "xampp81\\htdocs"];
const pathWamp = ["wamp\\www", "wamp64\\www"];

async function cekRegistryLaragon(): Promise<string | null> {
  try {
    const result = await execa("reg", [
      "query",
      "HKLM\\SOFTWARE\\Laragon",
      "/v",
      "Path",
    ]);
    const match = result.stdout.match(/REG_SZ\s+(.+)/);
    if (match?.[1]) {
      const basePath = match[1].trim();
      return `${basePath}\\www`;
    }
  } catch {
    // Registry key tidak ada
  }
  return null;
}

async function cekRegistryXampp(): Promise<string | null> {
  try {
    const result = await execa("reg", [
      "query",
      "HKLM\\SOFTWARE\\Apache Group\\XAMPP",
      "/v",
      "Install_Dir",
    ]);
    const match = result.stdout.match(/REG_SZ\s+(.+)/);
    if (match?.[1]) {
      const basePath = match[1].trim();
      return `${basePath}\\htdocs`;
    }
  } catch {
    // Registry key tidak ada
  }
  return null;
}

async function cekProsesBerjalan(): Promise<EnvironmentLokal[]> {
  const hasil: EnvironmentLokal[] = [];

  try {
    const result = await execa("tasklist", ["/FO", "CSV", "/NH"]);
    const proses = result.stdout.toLowerCase();

    if (proses.includes("laragon.exe")) {
      hasil.push({
        nama: "Laragon",
        path: "C:\\laragon\\www",
        terdeteksi: true,
        sumber: "Proses berjalan",
      });
    }

    if (proses.includes("xampp-control.exe")) {
      hasil.push({
        nama: "XAMPP",
        path: "C:\\xampp\\htdocs",
        terdeteksi: true,
        sumber: "Proses berjalan",
      });
    }

    if (proses.includes("wampmanager.exe")) {
      hasil.push({
        nama: "WAMP",
        path: "C:\\wamp\\www",
        terdeteksi: true,
        sumber: "Proses berjalan",
      });
    }
  } catch {
    // tasklist tidak tersedia
  }

  return hasil;
}

function cekPathManual(): EnvironmentLokal[] {
  const hasil: EnvironmentLokal[] = [];

  for (const drive of drives) {
    for (const p of pathLaragon) {
      const fullPath = `${drive}\\${p}`;
      if (existsSync(fullPath)) {
        hasil.push({
          nama: "Laragon",
          path: fullPath,
          terdeteksi: true,
          sumber: "Path terdeteksi",
        });
      }
    }

    for (const p of pathXampp) {
      const fullPath = `${drive}\\${p}`;
      if (existsSync(fullPath)) {
        hasil.push({
          nama: "XAMPP",
          path: fullPath,
          terdeteksi: true,
          sumber: "Path terdeteksi",
        });
      }
    }

    for (const p of pathWamp) {
      const fullPath = `${drive}\\${p}`;
      if (existsSync(fullPath)) {
        hasil.push({
          nama: "WAMP",
          path: fullPath,
          terdeteksi: true,
          sumber: "Path terdeteksi",
        });
      }
    }
  }

  return hasil;
}

export async function deteksiEnvironmentLokal(): Promise<EnvironmentLokal[]> {
  const hasil: EnvironmentLokal[] = [];
  const seen = new Set<string>();

  // 1. Cek registry
  const regLaragon = await cekRegistryLaragon();
  if (regLaragon && existsSync(regLaragon)) {
    hasil.push({
      nama: "Laragon",
      path: regLaragon,
      terdeteksi: true,
      sumber: "Registry",
    });
    seen.add(regLaragon.toLowerCase());
  }

  const regXampp = await cekRegistryXampp();
  if (regXampp && existsSync(regXampp)) {
    hasil.push({
      nama: "XAMPP",
      path: regXampp,
      terdeteksi: true,
      sumber: "Registry",
    });
    seen.add(regXampp.toLowerCase());
  }

  // 2. Cek proses berjalan
  const prosesHasil = await cekProsesBerjalan();
  for (const p of prosesHasil) {
    if (!seen.has(p.path.toLowerCase())) {
      hasil.push(p);
      seen.add(p.path.toLowerCase());
    }
  }

  // 3. Cek path manual di semua drive
  const manualHasil = cekPathManual();
  for (const m of manualHasil) {
    if (!seen.has(m.path.toLowerCase())) {
      hasil.push(m);
      seen.add(m.path.toLowerCase());
    }
  }

  return hasil;
}
