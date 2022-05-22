export type Scanner = ReturnType<typeof createScanner>;

export function createScanner(line: string) {
  return {
    scanTokens(): string[] {
      return line.split(' ');
    },
  }
}