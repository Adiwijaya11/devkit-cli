import { describe, it, expect } from "vitest";
import { execute } from "./executor.js";

describe("Executor", () => {
  it("harus berhasil menjalankan command valid", async () => {
    const hasil = await execute("node", ["--version"]);
    expect(hasil.success).toBe(true);
    expect(hasil.stdout).toBeTruthy();
  });

  it("harus gagal menjalankan command tidak valid", async () => {
    const hasil = await execute("command-tidak-ada-12345", ["--version"]);
    expect(hasil.success).toBe(false);
  });

  it("harus support dry run mode", async () => {
    const hasil = await execute("echo", ["test"], { dryRun: true });
    expect(hasil.success).toBe(true);
    expect(hasil.stdout).toContain("[DRY RUN]");
    expect(hasil.stdout).toContain("echo test");
  });

  it("harus menangkap stderr dengan benar", async () => {
    const hasil = await execute("node", ["-e", "console.error('error test')"]);
    expect(hasil.success).toBe(true);
    expect(hasil.stderr).toContain("error test");
  });
});
