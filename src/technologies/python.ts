import type { DefinisiTeknologi } from "../types/index.js";

export const python: DefinisiTeknologi = {
  nama: "Python",
  deskripsi: "Programming language serbaguna",
  requirements: [],
  perintahBuat: [],
  perintahInstall: ["sudo", "apt", "install", "-y", "python3", "python3-pip"],
  perintahVerifikasi: ["python3", "--version"],
  panduanManual: `Cara install Python:

Windows:
  1. Download dari https://www.python.org/downloads/
  2. Jalankan installer
  3. Centang "Add Python to PATH"

Linux (Ubuntu/Debian):
  sudo apt update
  sudo apt install -y python3 python3-pip

macOS:
  brew install python3

Setelah install, jalankan "python3 --version" untuk verifikasi.`,
};
