export class User {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public surname: string,
    public birthdate: string,
    public country: string,
    public city: string,
    public address: string,
    public postalCode: string,
    public phone: string,
  ) {}
}
