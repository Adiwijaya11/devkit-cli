import type { DefinisiTeknologi } from "../types/index.js";

export const composer: DefinisiTeknologi = {
  nama: "Composer",
  deskripsi: "Dependency manager untuk PHP",
  requirements: ["php"],
  perintahBuat: [],
  perintahInstall: ["php", "-r", "copy('https://getcomposer.org/installer', 'composer-setup.php');"],
  perintahVerifikasi: ["composer", "--version"],
  panduanManual: `Cara install Composer:

Windows:
  1. Download Composer-Setup.exe dari https://getcomposer.org/download/
  2. Jalankan Composer-Setup.exe
  3. Ikuti petunjuk instalasi

Linux/macOS:
  php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
  php composer-setup.php --install-dir=/usr/local/bin --filename=composer
  php -r "unlink('composer-setup.php');"

Setelah install, jalankan "composer --version" untuk verifikasi.`,
};
