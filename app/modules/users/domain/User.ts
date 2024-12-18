import { UserCPF } from "./UserCPF";
import type { SupportedLocale } from "~/packages/translation";
import { success } from "~/packages/result";

interface UserPropsI {
  id: number;
  telephone: string;
  email: string;
  jurisdiction: string;
  locale: SupportedLocale | null;
  timeZone: string;
  cpf: string | null;
}

export class User {
  public static new(props: UserPropsI) {
    const cpfResult = props.cpf ? UserCPF.new(props.cpf) : success(null);
    if (cpfResult.isFailure) {
      return cpfResult;
    }

    return success(new User(
      props.id,
      props.telephone,
      props.email,
      props.jurisdiction,
      props.locale,
      props.timeZone,
      cpfResult.value,
    ));
  }

  public toJSON(): UserPropsI {
    return {
      id: this.id,
      telephone: this.telephone,
      email: this.email,
      jurisdiction: this.jurisdiction,
      locale: this.locale,
      timeZone: this.timeZone,
      cpf: this.cpf?.value ?? null,
    };
  }

  private constructor(
    public readonly id: number,
    public readonly telephone: string,
    public readonly email: string,
    public readonly jurisdiction: string,
    public readonly locale: SupportedLocale | null,
    public readonly timeZone: string,
    public readonly cpf: UserCPF | null,
  ) {

  }
}
