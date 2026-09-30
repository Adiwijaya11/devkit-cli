export interface DefinisiTeknologi {
  nama: string;
  deskripsi: string;
  requirements: string[];
  perintahBuat: string[];
  perintahInstall: string[];
  perintahVerifikasi: string[];
  panduanManual?: string;
}
