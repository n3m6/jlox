export enum TokenType {
  // single-character;
  LEFT_PAREN = '{',
  RIGHT_PAREN = '}',
  LEFT_BRACE = '[',
  RIGHT_BRACE = ']',
  COMMA = ',',
  DOT = '.',
  MINUS = '-',
  PLUS = '+',
  SEMICOLON = ';',
  SLASH = '/',
  STAR = '*',

  // one or two character
  BANG = '!',
  BANG_EQUAL = '!=',
  EQUAL = '=',
  EQUAL_EQUAL = '==',
  GREATER = '>',
  GREATER_EQUAL = '>=',
  LESS = '<',
  LESS_EQUAL = '<=',

  // literals
  IDENTIFIER = 'identifier',
  STRING = 'string',
  NUMBER = 'number',

  // keywords
  AND = 'and',
  CLASS = 'class',
  ELSE = 'else',
  FALSE = 'false',
  FUN = 'fun',
  FOR = 'for',
  IF = 'if',
  NIL = 'nil',
  OR = 'or',
  PRINT = 'print',
  RETURN = 'return',
  SUPER = 'super',
  THIS = 'this',
  TRUE = 'true',
  VAR = 'var',
  WHILE = 'while',
  EOF = 'eof',
}

export class Token {
  type: TokenType;
  lexeme: string;
  literal: object | string | null;
  line: number;

  constructor(type: TokenType, lexeme: string, literal: object | string | null, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  toString() {
    return `${this.type} ${this.lexeme} ${JSON.stringify(this.literal)}`;
  }
}