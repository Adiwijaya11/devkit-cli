export interface EntriPerintah {
  teknologi: string;
  kategori: string;
  perintah: string;
  deskripsi: string;
}

const daftarPerintah: EntriPerintah[] = [
  {
    teknologi: "Laravel",
    kategori: "Buat Proyek",
    perintah: "composer create-project laravel/laravel my-app",
    deskripsi: "Membuat project Laravel baru",
  },
  {
    teknologi: "Laravel",
    kategori: "Buat Proyek",
    perintah: "laravel new my-app",
    deskripsi: "Membuat project Laravel baru (via Laravel Installer)",
  },
  {
    teknologi: "Laravel",
    kategori: "Jalankan",
    perintah: "php artisan serve",
    deskripsi: "Menjalankan server development Laravel",
  },
  {
    teknologi: "Laravel",
    kategori: "Jalankan",
    perintah: "php artisan migrate",
    deskripsi: "Menjalankan database migration",
  },
  {
    teknologi: "Laravel",
    kategori: "Build",
    perintah: "npm run dev",
    deskripsi: "Build assets frontend (Vite)",
  },
  {
    teknologi: "Laravel",
    kategori: "Build",
    perintah: "npm run build",
    deskripsi: "Build assets frontend untuk production",
  },
  {
    teknologi: "Vite",
    kategori: "Buat Proyek",
    perintah: "npm create vite@latest my-app -- --template vanilla",
    deskripsi: "Membuat project Vite dengan template vanilla",
  },
  {
    teknologi: "Vite",
    kategori: "Buat Proyek",
    perintah: "npm create vite@latest my-app -- --template react",
    deskripsi: "Membuat project Vite dengan template React",
  },
  {
    teknologi: "Vite",
    kategori: "Jalankan",
    perintah: "npm run dev",
    deskripsi: "Menjalankan server development Vite",
  },
  {
    teknologi: "Vite",
    kategori: "Build",
    perintah: "npm run build",
    deskripsi: "Build project Vite untuk production",
  },
  {
    teknologi: "React",
    kategori: "Install",
    perintah: "npm install react react-dom",
    deskripsi: "Install React dan React DOM",
  },
  {
    teknologi: "React",
    kategori: "Jalankan",
    perintah: "npm run dev",
    deskripsi: "Menjalankan server development",
  },
  {
    teknologi: "Tailwind CSS",
    kategori: "Install",
    perintah: "npm install -D tailwindcss @tailwindcss/vite",
    deskripsi: "Install Tailwind CSS v4 dengan Vite plugin",
  },
  {
    teknologi: "Tailwind CSS",
    kategori: "Konfigurasi",
    perintah: "npx tailwindcss init",
    deskripsi: "Membuat file konfigurasi Tailwind",
  },
  {
    teknologi: "Node.js",
    kategori: "Buat Proyek",
    perintah: "npm init -y",
    deskripsi: "Membuat project Node.js baru",
  },
  {
    teknologi: "Node.js",
    kategori: "Install",
    perintah: "npm install",
    deskripsi: "Install semua dependencies",
  },
  {
    teknologi: "Node.js",
    kategori: "Jalankan",
    perintah: "node index.js",
    deskripsi: "Menjalankan file JavaScript",
  },
];

export function dapatkanSemuaPerintah(): EntriPerintah[] {
  return daftarPerintah;
}

export function dapatkanTeknologiUnik(): string[] {
  return [...new Set(daftarPerintah.map((p) => p.teknologi))];
}

export function cariPerintah(teknologi: string): EntriPerintah[] {
  return daftarPerintah.filter(
    (p) => p.teknologi.toLowerCase() === teknologi.toLowerCase()
  );
}
