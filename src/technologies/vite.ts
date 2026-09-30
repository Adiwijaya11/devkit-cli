import type { DefinisiTeknologi } from "../types/index.js";

export const vite: DefinisiTeknologi = {
  nama: "Vite",
  deskripsi: "Build tool modern untuk project frontend",
  requirements: ["node", "npm"],
  perintahBuat: ["npm", "create", "vite@latest", "--", "--template", "vanilla"],
  perintahInstall: ["npm", "install"],
  perintahVerifikasi: ["npx", "vite", "--version"],
};
