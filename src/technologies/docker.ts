import type { DefinisiTeknologi } from "../types/index.js";

export const docker: DefinisiTeknologi = {
  nama: "Docker",
  deskripsi: "Platform containerization untuk deployment",
  requirements: [],
  perintahBuat: [],
  perintahInstall: ["curl", "-fsSL", "https://get.docker.com"],
  perintahVerifikasi: ["docker", "--version"],
  panduanManual: `Cara install Docker:

Windows:
  1. Download Docker Desktop dari https://www.docker.com/products/docker-desktop/
  2. Jalankan installer
  3. Restart komputer

Linux (Ubuntu/Debian):
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker $USER

macOS:
  brew install --cask docker

Setelah install, jalankan "docker --version" untuk verifikasi.`,
};
