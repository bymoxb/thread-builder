export class Token {
  private static _REGEXP: RegExp = /\S{1,200}|\s{1,200}/g;
  private static _DOUBLE_SIZE_CHAR_REGEXP: RegExp = /[^\u{0000}-\u{10FF}\u{2000}-\u{200D}\u{2010}-\u{201F}\u{2032}-\u{2037}]/gu;
  private static _BLANK_REGEXP: RegExp = /^\s+$/;
  private static _TWEET_BREAK_REGEXP: RegExp = /\n.*\n.*\n/s;

  private _text: string = '';
  private _length: number = 0;
  private _blank: boolean = false;
  private _tweetBreak: boolean = false;

  constructor(text: string) {
    this._text = text;
    this._length = Token._calculateLength(text);
    this._blank = Token._checkBlank(text);
    this._tweetBreak = Token._checkTweetBreak(text);
  }

  text(): string {
    return this._text;
  }

  length(): number {
    return this._length;
  }

  isBlank(): boolean {
    return this._blank;
  }

  isTweetBreak(): boolean {
    return this._tweetBreak;
  }

  private static _calculateLength(text: string): number {
    if (text.startsWith('http://') || text.startsWith('https://')) {
      return 23;
    } else {
      const emojis = text.match(Token._DOUBLE_SIZE_CHAR_REGEXP);
      return text.length + (emojis?.length || 0);
    }
  }

  private static _checkBlank(text: string): boolean {
    return text.match(this._BLANK_REGEXP) !== null;
  }

  private static _checkTweetBreak(text: string): boolean {
    return text.match(this._TWEET_BREAK_REGEXP) !== null;
  }

  static tokenize(text: string): Token[] {
    return (text.match(Token._REGEXP) || [])
      .filter(candidate => candidate !== '\r')
      .map(candidate => new Token(candidate));
  }
}