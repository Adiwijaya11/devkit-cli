import type { DefinisiTeknologi } from "../types/index.js";

export const tailwind: DefinisiTeknologi = {
  nama: "Tailwind CSS",
  deskripsi: "Utility-first CSS framework",
  requirements: ["node", "npm"],
  perintahBuat: [],
  perintahInstall: ["npm", "install", "-D", "tailwindcss", "@tailwindcss/vite"],
  perintahVerifikasi: ["npx", "tailwindcss", "--help"],
};
