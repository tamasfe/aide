interface UserPropsI {
  id: number;
  telephone: string;
  email: string;
  jurisdiction: string;
  locale: string;
  timeZone: string;
}

export class User {
  public static newFromProps(props: UserPropsI): User {
    return new User(props);
  }

  public toJSON(): UserPropsI {
    return {
      id: this.id,
      telephone: this.telephone,
      email: this.email,
      jurisdiction: this.jurisdiction,
      locale: this.locale,
      timeZone: this.timeZone,
    };
  }

  public readonly id: number;
  public readonly telephone: string;
  public readonly email: string;
  public readonly jurisdiction: string;
  public readonly locale: string;
  public readonly timeZone: string;

  private constructor(props: UserPropsI) {
    this.id = props.id;
    this.telephone = props.telephone;
    this.email = props.email;
    this.jurisdiction = props.jurisdiction;
    this.locale = props.locale;
    this.timeZone = props.timeZone;
  }
}
