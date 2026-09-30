import type { DefinisiTeknologi } from "../types/index.js";

export const nextjs: DefinisiTeknologi = {
  nama: "Next.js",
  deskripsi: "React framework untuk production",
  requirements: ["node", "npm"],
  perintahBuat: ["npx", "create-next-app@latest"],
  perintahInstall: ["npm", "install", "next", "react", "react-dom"],
  perintahVerifikasi: ["npx", "next", "--version"],
};
