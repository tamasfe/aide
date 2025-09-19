export interface SignupFlowPropsI {
  id: string;
  email: null | string;
  password: null | string;
  cpf: null | string;
  telephone: null | string;
  locale: null | string;
  timeZone: null | string;
  utmParameters: null | Record<string, string>;
}

export class SignupFlow {
  public static newFromProps(props: SignupFlowPropsI) {
    return new SignupFlow(props.id, props.email, props.password, props.cpf, props.telephone, props.locale, props.timeZone, props.utmParameters);
  }

  public newUpdatingProps(props: Omit<Partial<SignupFlowPropsI>, "id">) {
    const currentProps = this.toJSON();
    return SignupFlow.newFromProps({
      ...Object.assign(currentProps, props),
      id: this.id,
    });
  }

  private constructor(
    public readonly id: string,
    public readonly email: null | string,
    public readonly password: null | string,
    public readonly cpf: null | string,
    public readonly telephone: null | string,
    public readonly locale: null | string,
    public readonly timeZone: null | string,
    public readonly utmParameters: null | Record<string, string>,
  ) {}

  public toJSON(): SignupFlowPropsI {
    return {
      id: this.id,
      email: this.email || null,
      password: this.password || null,
      cpf: this.cpf || null,
      telephone: this.telephone || null,
      locale: this.locale || null,
      timeZone: this.timeZone || null,
      utmParameters: this.utmParameters || null,
    };
  }
}
