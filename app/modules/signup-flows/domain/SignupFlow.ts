import { UserCPF } from "~/modules/users/domain/UserCPF";
import { UserEmail } from "~/modules/users/domain/UserEmail";
import { UserPassword } from "~/modules/users/domain/UserPassword";
import { success } from "~/packages/result";

export interface SignupFlowPropsI {
  id: string;
  email: null | string;
  password: null | string;
  cpf: null | string;
  telephone: null | string;
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

    return success(
      new SignupFlow(props.id, userEmailResult.value, userPasswordResult.value, userCPFResult.value, props.telephone),
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
    public readonly telephone: null | string,
  ) {}

  public toJSON(): SignupFlowPropsI {
    return {
      id: this.id,
      email: this.email?.value ?? null,
      password: this.password?.value ?? null,
      cpf: this.cpf?.value ?? null,
      telephone: this.telephone,
    };
  }
}
