import type { DefinisiTeknologi } from "../types/index.js";

export const bootstrap: DefinisiTeknologi = {
  nama: "Bootstrap",
  deskripsi: "CSS framework populer untuk responsive design",
  requirements: ["node", "npm"],
  perintahBuat: [],
  perintahInstall: ["npm", "install", "bootstrap"],
  perintahVerifikasi: ["npm", "list", "bootstrap"],
};
