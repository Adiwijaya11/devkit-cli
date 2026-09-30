import type { DefinisiTeknologi } from "../types/index.js";

export const laravel: DefinisiTeknologi = {
  nama: "Laravel",
  deskripsi: "Framework PHP untuk aplikasi web",
  requirements: ["php", "composer"],
  perintahBuat: ["composer", "create-project", "laravel/laravel", "--no-interaction"],
  perintahInstall: ["composer", "install", "--no-interaction"],
  perintahVerifikasi: ["php", "artisan", "--version"],
};
