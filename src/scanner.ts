import { Token, TokenType } from './token';
import { Lox } from './lox';

function isDigit(char: string): boolean {
  return /^[0-9]$/.test(char);
}

function isAlpha(char: string): boolean {
  return /^[a-z]$/.test(char) || /^[A-Z]$/.test(char) || char === '_';
}

function isAlphaNumeric(char: string): boolean {
  return isAlpha(char) || isDigit(char);
}

const keywords = new Map<string, TokenType>();
keywords.set('and', TokenType.AND);
keywords.set('class', TokenType.CLASS);
keywords.set('else', TokenType.ELSE);
keywords.set('false', TokenType.FALSE);
keywords.set('for', TokenType.FOR);
keywords.set('fun', TokenType.FUN);
keywords.set('if', TokenType.IF);
keywords.set('nil', TokenType.NIL);
keywords.set('or', TokenType.OR);
keywords.set('print', TokenType.PRINT);
keywords.set('return', TokenType.RETURN);
keywords.set('super', TokenType.SUPER);
keywords.set('this', TokenType.THIS);
keywords.set('true', TokenType.TRUE);
keywords.set('var', TokenType.VAR);
keywords.set('while', TokenType.WHILE);

export class Scanner {
  source: string;
  tokens: Token[];
  start: number;
  current: number;
  line: number;

  constructor(source: string) {
    this.source = source;
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
  }

  isAtEnd() {
    return this.current >= this.source.length;
  }

  scanTokens(): Token[] {
    while(!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
    return this.tokens;
  }

  scanToken() {
    const c: string = this.advance();

    switch (c) {
      case '(': this.addToken(TokenType.LEFT_PAREN); break;
      case ')': this.addToken(TokenType.RIGHT_PAREN); break;
      case '{': this.addToken(TokenType.LEFT_BRACE); break;
      case '}': this.addToken(TokenType.RIGHT_BRACE); break;
      case ',': this.addToken(TokenType.COMMA); break;
      case '.': this.addToken(TokenType.DOT); break;
      case '-': this.addToken(TokenType.MINUS); break;
      case '+': this.addToken(TokenType.PLUS); break;
      case ';': this.addToken(TokenType.SEMICOLON); break;
      case '*': this.addToken(TokenType.STAR); break;

      case '!':
        this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG)
        break;
      case '=':
        this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
        break;
      case '<':
        this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case '>':
        this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
        break;

      case '/':
        if (this.match('/')) {
          while (this.peek() !== "\n" && !this.isAtEnd()) {
            this.advance();
          }
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;

      case ' ': break;
      case "\r": break;
      case "\t": break;
      case "\n": this.line = this.line + 1; break;


      case '"': this.string(); break;

      default:

        if(isDigit(c)) {
          this.number();
        } else if(isAlpha(c)) {
          this.identifier();
        } else {
            Lox.error(this.line, `Unexpected character ${c}`);
        }
        break;
    }
  }

  private advance(): string {
    this.current = this.current + 1;
    return this.source.charAt(this.current -1);
  }

  private addToken(type: TokenType, literal?: object | string) {
    const text: string = this.source.substring(this.start, this.current);
    const _literal = !!literal ? literal : null;
    this.tokens.push(new Token(type, text, _literal, this.line));
  }

  private match(char: string): boolean {
    if (this.isAtEnd()) return false;
    if(this.source.charAt(this.current) != char) return false;

    this.current = this.current + 1;
    return true;
  }

  private peek(): string {
    if (this.isAtEnd()) return "\0";
    return this.source.charAt(this.current);
  }

  private string() {
    while(this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === "\n") this.line = this.line + 1;
      this.advance();
    }

    if(this.isAtEnd()) {
      Lox.error(this.line, "Unterminated string.");
      return;
    }

    this.advance();

    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }

  private number() {
    while(isDigit(this.peek())) this.advance();

    if(this.peek() === '.' && isDigit(this.peekNext())) {
      this.advance();

      while(isDigit(this.peek())) this.advance();
    }

    this.addToken(TokenType.NUMBER, this.source.substring(this.start, this.current));
  }

  private peekNext() {
    if(this.current + 1 >= this.source.length) return "\0";

    return this.source.charAt(this.current + 1);
  }

  private identifier() {
    while(isAlphaNumeric(this.peek())) this.advance();

    const text = this.source.substring(this.start, this.current);
    let type: TokenType | undefined = keywords.get(text);
    if(!type) type = TokenType.IDENTIFIER;

    this.addToken(type);
  }
}