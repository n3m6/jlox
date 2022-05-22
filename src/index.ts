import { argv, stdin as input, stdout as output } from 'node:process';
import * as fs from 'fs';
import { createScanner, Scanner } from './scanner';

// @ts-ignore
const readline = require('readline');

function startLox(args: string[]) {
  let hadError = false;

  function runFile(script: string) {
    console.log(script);
    const fileStream = fs.createReadStream(script);
    const rl = readline.createInterface({ input: fileStream, terminal: false});
    rl.on('line', (line: string) => {
      run(line)
    });
  }

  async function runPrompt() {
    console.log('Running prompt...');
    const rl = readline.createInterface({ input, output, terminal: true });
    const ask = (query): Promise<string> => new Promise((resolve) => rl.question(query, resolve));

    while(true) {
      const line = await ask('> ');
      if( line === '') break;
      run(line);
    }
    rl.close();
  }

  function reportError (line: number, message:string) {
    console.log(`[${line}]: ${message}`);
    hadError = true;
  }

  function run(line: string) {
    const scanner: Scanner = createScanner(line);
    const tokens = scanner.scanTokens();
    console.log(tokens);

    if(hadError) process.exit(1);
  }

  function choose(args: string[]) {
    if (args.length < 3) return runPrompt();
    if (args.length === 3) return runFile(args[2]);

    console.log('Usage: jlox [script]');
  }

  choose(args);
}

startLox(argv);