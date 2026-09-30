import type { DefinisiTeknologi } from "../types/index.js";
import { node } from "../technologies/node.js";
import { vite } from "../technologies/vite.js";
import { laravel } from "../technologies/laravel.js";
import { react } from "../technologies/react.js";
import { tailwind } from "../technologies/tailwind.js";
import { flutter } from "../technologies/flutter.js";
import { composer } from "../technologies/composer.js";
import { php } from "../technologies/php.js";
import { docker } from "../technologies/docker.js";
import { python } from "../technologies/python.js";
import { go } from "../technologies/go.js";
import { nextjs } from "../technologies/nextjs.js";
import { express } from "../technologies/express.js";
import { bootstrap } from "../technologies/bootstrap.js";

const daftarTeknologi: DefinisiTeknologi[] = [
  node,
  vite,
  laravel,
  react,
  tailwind,
  flutter,
  composer,
  php,
  docker,
  python,
  go,
  nextjs,
  express,
  bootstrap,
];

export function dapatkanSemuaTeknologi(): DefinisiTeknologi[] {
  return daftarTeknologi;
}

export function dapatkanTeknologi(nama: string): DefinisiTeknologi | undefined {
  return daftarTeknologi.find((t) => t.nama.toLowerCase() === nama.toLowerCase());
}
