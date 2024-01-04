export class VPost {
  private _text: string = "";
  private _length: number = 0;
  private _maxLength: number = 0;

  constructor(text: string, length: number, maxLength: number) {
    this._text = text;
    this._length = length;
    this._maxLength = maxLength;
  }

  text(): string {
    return this._text;
  }

  length(): number {
    return this._length;
  }

  maxLength(): number {
    return this._maxLength;
  }
}