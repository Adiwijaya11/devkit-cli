import type { DefinisiTeknologi } from "../types/index.js";

export const flutter: DefinisiTeknologi = {
  nama: "Flutter",
  deskripsi: "Framework UI untuk mobile, web, dan desktop",
  requirements: ["git"],
  perintahBuat: ["flutter", "create"],
  perintahInstall: ["flutter", "pub", "get"],
  perintahVerifikasi: ["flutter", "--version"],
};
