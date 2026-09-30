import type { DefinisiTeknologi } from "../types/index.js";

export const express: DefinisiTeknologi = {
  nama: "Express.js",
  deskripsi: "Web framework Node.js minimalis",
  requirements: ["node", "npm"],
  perintahBuat: ["npx", "express-generator"],
  perintahInstall: ["npm", "install", "express"],
  perintahVerifikasi: ["npm", "list", "express"],
};
