import type { UserCPF } from "./UserCPF";
import type { UserEmail } from "./UserEmail";
import type { ErrorRegisteringUser } from "./errors/ErrorRegisteringUser";
import type { EmptyResult } from "~/packages/result";

export interface BrazilianUserRegistererI {
  handle(
    email: UserEmail,
    password: string,
    phone: string,
    CPF: UserCPF,
  ): Promise<EmptyResult<ErrorRegisteringUser>>;
}
