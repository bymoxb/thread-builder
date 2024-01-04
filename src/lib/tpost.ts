import { Token } from "./token";
import { VPost } from "./vpost";

export enum PostModeEnum {
  TWITTER = 280,
  THREADS = 500,
}

export class TPost {

  private static MAX_LENGTH: number = 280;

  private _tokens: Token[] = [];
  private _tokensLength: number = 0;
  private _firstToken: Token | null = null;
  private _lastToken: Token | null = null;
  private _indexToken: Token | null = null;
  private _index: number = 1;
  private _nextTweet: TPost | null = null;

  placeToken(token: Token): TPost {
    if (this._containsTweetBreak()) {
      const nextTweet = this._createNextTweet();
      nextTweet._pushToken(token);
      return nextTweet;
    } else if (this._tokens.length > 0 || !token.isTweetBreak()) {
      this._pushToken(token);
      this._moveOverflowingTokensToNextTweet();
      return this._nextTweet || this;
    } else {
      return this;
    }
  }

  private _pushToken(token: Token): void {
    this._tokens.push(token);
    if (this._firstToken === null) {
      this._firstToken = token;
    }
    this._lastToken = token;
    this._tokensLength += token.length();
  }

  private _unshiftToken(token: Token): void {
    this._tokens.unshift(token);
    if (this._lastToken === null) {
      this._lastToken = token;
    }
    this._firstToken = token;
    this._tokensLength += token.length();
  }

  private _popToken(): Token {
    const token = this._tokens.pop()!;
    if (this._tokens.length === 0) {
      this._firstToken = null;
      this._lastToken = null;
    } else {
      this._lastToken = this._tokens[this._tokens.length - 1];
    }
    this._tokensLength -= token.length();
    return token;
  }

  private _createNextTweet(): TPost {
    const tweet = new TPost();
    tweet._index = this._index + 1;
    this._nextTweet = tweet;
    return tweet;
  }

  private _isOverflow(): boolean {
    return this.length() > TPost.MAX_LENGTH;
  }

  length(): number {
    const firstBlankLength = this._firstToken?.isBlank() ? this._firstToken.length() : 0;
    const lastBlankLength = this._firstToken !== this._lastToken && this._lastToken?.isBlank() ? this._lastToken.length() : 0;
    const indexLength = this._indexToken?.length() || 0;
    return this._tokensLength - firstBlankLength - lastBlankLength + indexLength;
  }

  private _containsTweetBreak(): boolean {
    return this._lastToken?.isTweetBreak() || false;
  }

  reconcileChain(lastTweet: TPost): void {
    if (lastTweet === null) throw new Error('Last tweet is null!');

    let iterations = 0;
    let noOfTweets = 0;
    do {
      noOfTweets = lastTweet._index;
      if (noOfTweets <= 1) break;

      let tweet: TPost | null = this;
      do {
        tweet._indexToken = this._createIndexToken(tweet._index, noOfTweets);
        tweet._moveOverflowingTokensToNextTweet();

        lastTweet = tweet;
        tweet = tweet._nextTweet;
        if (++iterations > 100_000) throw new Error(`Infinite loop! ${lastTweet}`);
      } while (tweet != null);
    } while (noOfTweets < lastTweet._index);
  }

  private _moveOverflowingTokensToNextTweet(): void {
    if (this._tokens.length === 0) throw new Error('Tweet is empty!');
    if (!this._isOverflow()) return;

    const nextTweet = this._nextTweet || this._createNextTweet();
    while (this._isOverflow()) {
      if (this._tokens.length === 1) throw new Error('Tweet has only one token!');
      const lastToken = this._popToken();
      nextTweet._unshiftToken(lastToken);
    }
  }

  private _createIndexToken(index: number, noOfTokens: number): Token | null {
    if (noOfTokens <= 1) return null;
    return new Token(` (${index}/${noOfTokens})`);
  }

  private _normalizeText(text: string) {
    return text
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('\n', '<br>')
  }

  toText(): string {
    const tokensText = this._tokens.map(token => token.text()).join('');
    const indexText = this._indexToken?.text() || '';
    return tokensText.trim() + indexText;
  }

  chainToList(): TPost[] {
    const tweets: TPost[] = [];
    let tweet: TPost | null = this;
    do {
      tweets.push(tweet);
      tweet = tweet._nextTweet;
    } while (tweet != null);
    return tweets;
  }

  toPosts() {
    return this
      .chainToList()
      .map(t => new VPost(
        this._normalizeText(t.toText()),
        t.length(),
        TPost.MAX_LENGTH,
      ))
  }

  static createTweetChain(tokens: Token[], mode: PostModeEnum): TPost {
    this.MAX_LENGTH = mode;

    const firstTweet = new TPost();
    let tweet: TPost = firstTweet;
    for (let token of tokens) {
      tweet = tweet.placeToken(token);
    }
    firstTweet.reconcileChain(tweet);
    return firstTweet;
  }
}
