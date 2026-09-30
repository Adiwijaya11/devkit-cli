import { describe, it, expect } from "vitest";
import { deteksiSemua } from "./detector.js";

describe("Detector", () => {
  it("harus mengembalikan array hasil deteksi", async () => {
    const hasil = await deteksiSemua();
    expect(Array.isArray(hasil)).toBe(true);
    expect(hasil.length).toBeGreaterThan(0);
  });

  it("setiap hasil harus punya properti yang benar", async () => {
    const hasil = await deteksiSemua();
    for (const r of hasil) {
      expect(r).toHaveProperty("nama");
      expect(r).toHaveProperty("terinstall");
      expect(r).toHaveProperty("versi");
      expect(typeof r.nama).toBe("string");
      expect(typeof r.terinstall).toBe("boolean");
    }
  });

  it("Node.js harus terinstall di environment ini", async () => {
    const hasil = await deteksiSemua();
    const node = hasil.find((r) => r.nama === "Node.js");
    expect(node).toBeDefined();
    expect(node?.terinstall).toBe(true);
    expect(node?.versi).toBeTruthy();
  });
});
