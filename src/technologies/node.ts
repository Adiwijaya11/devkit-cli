import type { DefinisiTeknologi } from "../types/index.js";

export const node: DefinisiTeknologi = {
  nama: "Node.js",
  deskripsi: "Project Node.js dasar dengan npm",
  requirements: ["node", "npm"],
  perintahBuat: ["npm", "init", "-y"],
  perintahInstall: [],
  perintahVerifikasi: ["node", "--version"],
};
