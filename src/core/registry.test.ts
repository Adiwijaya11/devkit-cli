import { describe, it, expect } from "vitest";
import { dapatkanSemuaTeknologi, dapatkanTeknologi } from "./registry.js";

describe("Technology Registry", () => {
  it("harus mengembalikan array teknologi", () => {
    const hasil = dapatkanSemuaTeknologi();
    expect(Array.isArray(hasil)).toBe(true);
    expect(hasil.length).toBeGreaterThan(0);
  });

  it("setiap teknologi harus punya properti yang benar", () => {
    const hasil = dapatkanSemuaTeknologi();
    for (const t of hasil) {
      expect(t).toHaveProperty("nama");
      expect(t).toHaveProperty("deskripsi");
      expect(t).toHaveProperty("requirements");
      expect(t).toHaveProperty("perintahBuat");
      expect(t).toHaveProperty("perintahInstall");
      expect(t).toHaveProperty("perintahVerifikasi");
      expect(Array.isArray(t.requirements)).toBe(true);
    }
  });

  it("harus bisa mencari teknologi berdasarkan nama", () => {
    const vite = dapatkanTeknologi("Vite");
    expect(vite).toBeDefined();
    expect(vite?.nama).toBe("Vite");
  });

  it("harus case-insensitive saat mencari", () => {
    const laravel = dapatkanTeknologi("laravel");
    expect(laravel).toBeDefined();
    expect(laravel?.nama).toBe("Laravel");
  });

  it("harus mengembalikan undefined untuk teknologi tidak dikenal", () => {
    const hasil = dapatkanTeknologi("TeknologiTidakAda");
    expect(hasil).toBeUndefined();
  });
});
