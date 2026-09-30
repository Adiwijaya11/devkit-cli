import type { DefinisiTeknologi } from "../types/index.js";

export const php: DefinisiTeknologi = {
  nama: "PHP",
  deskripsi: "Scripting language untuk web development",
  requirements: [],
  perintahBuat: [],
  perintahInstall: ["sudo", "apt", "install", "-y", "php", "php-cli", "php-mbstring", "php-xml", "php-zip"],
  perintahVerifikasi: ["php", "--version"],
  panduanManual: `Cara install PHP:

Windows:
  1. Download dari https://windows.php.net/download/
  2. Extract ke C:\\php
  3. Tambahkan C:\\php ke PATH environment variable

Linux (Ubuntu/Debian):
  sudo apt update
  sudo apt install -y php php-cli php-mbstring php-xml php-zip

macOS:
  brew install php

Setelah install, jalankan "php --version" untuk verifikasi.`,
};
