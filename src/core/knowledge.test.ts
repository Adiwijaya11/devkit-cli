import { describe, it, expect } from "vitest";
import { dapatkanSemuaPerintah, dapatkanTeknologiUnik, cariPerintah } from "./knowledge.js";

describe("Knowledge Registry", () => {
  it("harus mengembalikan array perintah", () => {
    const hasil = dapatkanSemuaPerintah();
    expect(Array.isArray(hasil)).toBe(true);
    expect(hasil.length).toBeGreaterThan(0);
  });

  it("setiap perintah harus punya properti yang benar", () => {
    const hasil = dapatkanSemuaPerintah();
    for (const p of hasil) {
      expect(p).toHaveProperty("teknologi");
      expect(p).toHaveProperty("kategori");
      expect(p).toHaveProperty("perintah");
      expect(p).toHaveProperty("deskripsi");
      expect(typeof p.perintah).toBe("string");
      expect(p.perintah.length).toBeGreaterThan(0);
    }
  });

  it("harus mengembalikan teknologi unik", () => {
    const hasil = dapatkanTeknologiUnik();
    expect(Array.isArray(hasil)).toBe(true);
    expect(new Set(hasil).size).toBe(hasil.length);
  });

  it("harus bisa mencari perintah berdasarkan teknologi", () => {
    const hasil = cariPerintah("Laravel");
    expect(hasil.length).toBeGreaterThan(0);
    for (const p of hasil) {
      expect(p.teknologi).toBe("Laravel");
    }
  });

  it("harus case-insensitive saat mencari", () => {
    const hasil = cariPerintah("laravel");
    expect(hasil.length).toBeGreaterThan(0);
  });
});
