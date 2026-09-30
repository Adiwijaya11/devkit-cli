import { execa } from "execa";

export interface ExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
}

export interface ExecutionOptions {
  cwd?: string;
  dryRun?: boolean;
  shell?: boolean;
}

export async function execute(
  command: string,
  args: string[],
  options: ExecutionOptions = {}
): Promise<ExecutionResult> {
  const { cwd, dryRun, shell } = options;

  if (dryRun) {
    return {
      success: true,
      stdout: `[DRY RUN] ${command} ${args.join(" ")}`,
      stderr: "",
    };
  }

  try {
    const result = shell
      ? await execa(`${command} ${args.join(" ")}`, cwd ? { shell: true, cwd } : { shell: true })
      : await execa(command, args, cwd ? { cwd } : undefined);
    return {
      success: true,
      stdout: result.stdout,
      stderr: result.stderr,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      const execaError = error as Error & { stdout?: string; stderr?: string };
      return {
        success: false,
        stdout: execaError.stdout ?? "",
        stderr: execaError.stderr ?? error.message,
      };
    }
    return {
      success: false,
      stdout: "",
      stderr: "Terjadi kesalahan yang tidak diketahui",
    };
  }
}
