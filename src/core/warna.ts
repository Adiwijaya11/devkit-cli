export const reset = "\x1b[0m";
export const bold = "\x1b[1m";
export const dim = "\x1b[2m";
export const red = "\x1b[31m";
export const green = "\x1b[32m";
export const yellow = "\x1b[33m";
export const blue = "\x1b[34m";
export const magenta = "\x1b[35m";
export const cyan = "\x1b[36m";
export const white = "\x1b[37m";

export const warnaTeknologi: Record<string, string> = {
  "node.js": green,
  "vite": magenta,
  "laravel": red,
  "react": cyan,
  "tailwind css": cyan,
  "flutter": blue,
  "composer": yellow,
  "php": magenta,
  "docker": blue,
  "python": yellow,
  "go": cyan,
  "git": red,
  "npm": red,
  "next.js": white,
  "bootstrap": magenta,
  "express.js": yellow,
};

export function warnaUntukTeknologi(nama: string): string {
  return warnaTeknologi[nama.toLowerCase()] ?? white;
}

export function teksBerwarna(teks: string, warna: string): string {
  return `${warna}${teks}${reset}`;
}
