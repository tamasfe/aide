import { UserCPF } from "~/modules/users/domain/UserCPF";
import { UserEmail } from "~/modules/users/domain/UserEmail";
import { success, type CustomError, type Result } from "~/packages/result";

export class SignupFlow {
  public static newFromProps(
    id: string,
    email: null | string,
    password: null | string,
    cpf: null | string,
  ) {
    const userEmailResult = email ? UserEmail.new(email) : success(null);
    if (userEmailResult.isFailure) {
      return userEmailResult;
    }

    const userCPFResult = cpf ? UserCPF.new(cpf) : success(null);
    if (userCPFResult.isFailure) {
      return userCPFResult;
    }

    return success(
      new SignupFlow(id, userEmailResult.value, password, userCPFResult.value),
    );
  }

  public newUpdatingCpf(cpf: UserCPF): Result<SignupFlow, CustomError> {
    return success(
      new SignupFlow(this.id, this.email, this.password, cpf, true),
    );
  }

  private constructor(
    public readonly id: string,
    public readonly email: null | UserEmail,
    public readonly password: null | string,
    public readonly cpf: null | UserCPF,
    public readonly needsPersisting = false,
  ) {}

  public toJSON() {
    return {
      id: this.id,
      email: this.email?.value ?? null,
      password: this.password,
      cpf: this.cpf?.value ?? null,
    };
  }
}
