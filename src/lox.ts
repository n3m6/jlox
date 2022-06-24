import { argv, stdin as input, stdout as output } from 'node:process';
import * as fs from 'fs';
import { Scanner } from './scanner';

// @ts-ignore
const readline = require('readline');

export class Lox {

  static hadError: boolean = false;



  public static runFile(script: string) {
    console.log(script);
    const fileStream = fs.createReadStream(script);
    const rl = readline.createInterface({ input: fileStream, terminal: false});
    rl.on('line', (line: string) => {
      Lox.run(line)
    });
  }

  public static async runPrompt() {
    console.log('Running prompt...');
    const rl = readline.createInterface({ input, output, terminal: true });
    const ask = (query): Promise<string> => new Promise((resolve) => rl.question(query, resolve));

    while(true) {
      const line = await ask('> ');
      if( line === '') break;
      Lox.run(line);
    }
    rl.close();
  }

  public static run(line: string) {
    const scanner: Scanner = new Scanner(line);
    const tokens = scanner.scanTokens();
    console.log(tokens);

    if(Lox.hadError) process.exit(1);
  }

  public static error(line: number, message: string) {
    Lox.reportError(line, message);
  }

  public static reportError (line: number, message:string) {
    console.log(`[${line}]: ${message}`);
    Lox.hadError = true;
  }

  public static choose(args: string[]) {
    if (args.length < 3) return Lox.runPrompt();
    if (args.length === 3) return Lox.runFile(args[2]);

    console.log('Usage: jlox [script]');
  }

  public static startLox(args: string[]) {
    Lox.choose(args);
  }
}