import validateCpf from "validar-cpf";
import { CustomError, fail, success, type Result } from "~/packages/result";

export class UserCPF {
  public static new(value: string): Result<UserCPF, InvalidCPF> {
    try {
      return success(new UserCPF(value));
    }
    catch (error) {
      if (error instanceof InvalidCPF) {
        return fail(error);
      }
      throw error;
    }
  }

  private constructor(public readonly value: string) {
    if (!value) {
      throw new InvalidCPF(value, "The CPF was empty");
    }

    const elevenDigitCpfForModulo11Validation = value.replace(/\D/g, "").padStart(11, "0");

    if (!this.isValidCPF(elevenDigitCpfForModulo11Validation)) {
      throw new InvalidCPF(value, "The CPF format is not valid");
    }
  }

  /**
   * Validates Brazilian CPF document number using the "módulo 11" algorithm.
   * Anything in the input string that is not a number will be removed during the validation,
   * so there is no need to sanitize the input beforehand.
   * Another alternative: https://gist.github.com/vazgabriel/ca1266fae95a6c1d6fb63f345b826f96
   * Official code: http://www.receita.fazenda.gov.br/aplicacoes/atcta/cpf/funcoes.js
   */
  private isValidCPF(input: string): boolean {
    return validateCpf(input);
  }
}

export class InvalidCPF extends CustomError {
  public override name = "InvalidCPF" as const;

  constructor(attemptedValue: string, reason: string) {
    super("Invalid CPF value", { attemptedValue, reason });
  }
}
