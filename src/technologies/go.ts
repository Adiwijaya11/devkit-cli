import type { DefinisiTeknologi } from "../types/index.js";

export const go: DefinisiTeknologi = {
  nama: "Go",
  deskripsi: "Programming language dari Google",
  requirements: [],
  perintahBuat: [],
  perintahInstall: ["sudo", "apt", "install", "-y", "golang-go"],
  perintahVerifikasi: ["go", "version"],
  panduanManual: `Cara install Go:

Windows:
  1. Download MSI installer dari https://go.dev/dl/
  2. Jalankan installer
  3. Restart terminal

Linux (Ubuntu/Debian):
  sudo apt update
  sudo apt install -y golang-go

macOS:
  brew install go

Setelah install, jalankan "go version" untuk verifikasi.`,
};
