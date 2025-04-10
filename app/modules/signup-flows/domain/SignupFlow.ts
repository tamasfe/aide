import { UserCPF } from "~/modules/users/domain/UserCPF";
import { UserEmail } from "~/modules/users/domain/UserEmail";
import { UserPassword } from "~/modules/users/domain/UserPassword";
import { UserTelephone } from "~/modules/users/domain/UserTelephone";
import { success } from "~/packages/result";

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
    const userEmailResult = props.email ? UserEmail.new(props.email) : success(null);
    if (userEmailResult.isFailure) {
      return userEmailResult;
    }

    const userCPFResult = props.cpf ? UserCPF.new(props.cpf) : success(null);
    if (userCPFResult.isFailure) {
      return userCPFResult;
    }

    const userPasswordResult = props.password ? UserPassword.new(props.password) : success(null);
    if (userPasswordResult.isFailure) {
      return userPasswordResult;
    }

    const userTelephoneResult = props.telephone ? UserTelephone.newFromSingleValue(props.telephone) : success(null);
    if (userTelephoneResult.isFailure) {
      return userTelephoneResult;
    }

    return success(
      new SignupFlow(props.id, userEmailResult.value, userPasswordResult.value, userCPFResult.value, userTelephoneResult.value, props.locale, props.timeZone, props.utmParameters),
    );
  }

  public newUpdatingProps(props: Omit<Partial<SignupFlowPropsI>, "id">) {
    return SignupFlow.newFromProps({
      ...this.toJSON(),
      ...props,
      id: this.id,
    });
  }

  private constructor(
    public readonly id: string,
    public readonly email: null | UserEmail,
    public readonly password: null | UserPassword,
    public readonly cpf: null | UserCPF,
    public readonly telephone: null | UserTelephone,
    public readonly locale: null | string,
    public readonly timeZone: null | string,
    public readonly utmParameters: null | Record<string, string>,
  ) {}

  public toJSON(): SignupFlowPropsI {
    return {
      id: this.id,
      email: this.email?.value ?? null,
      password: this.password?.value ?? null,
      cpf: this.cpf?.value ?? null,
      telephone: this.telephone?.value ?? null,
      locale: this.locale,
      timeZone: this.timeZone,
      utmParameters: this.utmParameters,
    };
  }
}
