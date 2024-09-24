import type { VueWrapper } from "@vue/test-utils";

export class EmailBaseInputGroupTestSuite {
  public static VALID_EMAIL = "ivan.prats@studioprats.com";

  async setInput(value: string) {
    const input = this.wrapper.find(this.inputSelector);
    if (!input || !input.exists()) {
      throw new Error("Email input was not found");
    }

    await input.setValue(value);
  }

  constructor(private wrapper: VueWrapper) {
  }

  private inputSelector = "input[name=email]";
}

export class PasswordBaseInputGroupTestSuite {
  public static VALID_EMAIL = "secretPasswordShhh123";

  async setInput(value: string) {
    const input = this.wrapper.find(this.inputSelector);
    if (!input || !input.exists()) {
      throw new Error("Password input was not found");
    }

    await input.setValue(value);
  }

  constructor(private wrapper: VueWrapper) {
  }

  private inputSelector = "input[name=password]";
}

export class CpfBaseInputGroupTestSuite {
  public static VALID_CPF = "839.853.700-01";

  async setInput(value: string) {
    const input = this.wrapper.find(this.inputSelector);
    if (!input || !input.exists()) {
      throw new Error("CPF input was not found");
    }

    await input.setValue(value);
  }

  constructor(private wrapper: VueWrapper) {

  }

  private inputSelector = "input[name=cpf]";
}

export class TelephoneBaseInputGroupTestSuite {
  public static VALID_EMAIL = "123123123";

  async setInput(value: string) {
    const input = this.wrapper.find(this.inputSelector);
    if (!input || !input.exists()) {
      throw new Error("Telephone input was not found");
    }

    await input.setValue(value);
  }

  constructor(private wrapper: VueWrapper) {

  }

  private inputSelector = "input[name=telephone]";
}
