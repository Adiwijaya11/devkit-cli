import * as p from "@clack/prompts";
import { dapatkanTeknologiUnik, cariPerintah } from "../core/knowledge.js";
import { reset, bold, dim, warnaUntukTeknologi, teksBerwarna } from "../core/warna.js";

export async function jalankanReferensiPerintah(): Promise<void> {
  p.intro("Referensi Perintah");

  const daftarTeknologi = dapatkanTeknologiUnik();

  const teknologiDipilih = await p.select({
    message: "Pilih teknologi:",
    options: daftarTeknologi.map((t) => ({
      value: t,
      label: teksBerwarna(t, warnaUntukTeknologi(t)),
    })),
  });

  if (p.isCancel(teknologiDipilih)) {
    p.cancel("Operasi dibatalkan.");
    return;
  }

  const perintah = cariPerintah(teknologiDipilih as string);
  const warnaTeknologi = warnaUntukTeknologi(teknologiDipilih as string);

  const baris = perintah.map((p) => {
    return `${teksBerwarna(p.kategori, warnaTeknologi)}:\n  ${p.perintah}\n  ${dim}${p.deskripsi}${reset}`;
  });

  p.note(baris.join("\n\n"), teksBerwarna(teknologiDipilih as string, warnaTeknologi));

  p.outro("Referensi perintah selesai.");
}
