export class User {
  constructor(
    public username: string,
    private _token: string
  ) {}

  get token() {
    return this._token;
  }
}
