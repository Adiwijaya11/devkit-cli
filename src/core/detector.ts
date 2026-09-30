import { execa } from "execa";

export interface StatusAlat {
  nama: string;
  terinstall: boolean;
  versi: string | null;
}

interface DefinisiAlat {
  nama: string;
  perintah: string;
  args: string[];
  parseVersi: (stdout: string) => string;
}

const daftarAlat: DefinisiAlat[] = [
  {
    nama: "Node.js",
    perintah: "node",
    args: ["--version"],
    parseVersi: (stdout: string): string => stdout.trim().replace(/^v/, ""),
  },
  {
    nama: "npm",
    perintah: "npm",
    args: ["--version"],
    parseVersi: (stdout: string): string => stdout.trim(),
  },
  {
    nama: "Git",
    perintah: "git",
    args: ["--version"],
    parseVersi: (stdout: string): string => {
      const match = stdout.match(/(\d+\.\d+\.\d+)/);
      return match?.[1] ?? stdout.trim();
    },
  },
  {
    nama: "PHP",
    perintah: "php",
    args: ["--version"],
    parseVersi: (stdout: string): string => {
      const match = stdout.match(/PHP (\d+\.\d+\.\d+)/);
      return match?.[1] ?? stdout.trim();
    },
  },
  {
    nama: "Composer",
    perintah: "composer",
    args: ["--version"],
    parseVersi: (stdout: string): string => {
      const match = stdout.match(/(\d+\.\d+\.\d+)/);
      return match?.[1] ?? stdout.trim();
    },
  },
];

async function deteksiAlat(alat: DefinisiAlat): Promise<StatusAlat> {
  try {
    const hasil = await execa(alat.perintah, alat.args, { timeout: 10000 });
    return {
      nama: alat.nama,
      terinstall: true,
      versi: alat.parseVersi(hasil.stdout),
    };
  } catch {
    return {
      nama: alat.nama,
      terinstall: false,
      versi: null,
    };
  }
}

export async function deteksiSemua(): Promise<StatusAlat[]> {
  return Promise.all(daftarAlat.map(deteksiAlat));
}
