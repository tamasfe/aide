export const PAYMENT_PIX_KEY_TYPES = ["CPF", "EMAIL", "PHONE", "EVP"] as const;

type PaymentActiveSettings = {
  keyType: "CPF";
} | {
  keyType: "EMAIL" | "PHONE" | "EVP";
  keyValue: string | null;
} | {
  keyType: null;
};

export interface UserSettingsPaymentPixPropsI {
  keyType: PaymentActiveSettings["keyType"];
  keyEmail: string | null;
  keyEvp: string | null;
  keyPhone: string | null;
}

export class UserSettingsPaymentPix {
  public static new(props: UserSettingsPaymentPixPropsI) {
    return new UserSettingsPaymentPix({
      ...props,
    });
  }

  public toJSON(): UserSettingsPaymentPixPropsI {
    return {
      keyType: this.config.keyType,
      keyEmail: this.config.keyEmail,
      keyEvp: this.config.keyEvp,
      keyPhone: this.config.keyPhone,
    };
  }

  public get activeSettings(): PaymentActiveSettings {
    const pixKeyType = this.config.keyType;
    switch (pixKeyType) {
      case null:
      case "CPF":
        return {
          keyType: pixKeyType,
        };

      case "EMAIL":
        return {
          keyType: "EMAIL",
          keyValue: this.config.keyEmail,
        };

      case "EVP":
        return {
          keyType: "EVP",
          keyValue: this.config.keyEvp,
        };

      case "PHONE":
        return {
          keyType: "PHONE",
          keyValue: this.config.keyPhone,
        };
    }
  }

  public get propsWithActiveSettings(): UserSettingsPaymentPixPropsI {
    return {
      keyType: this.activeSettings.keyType,
      keyEmail: this.activeSettings.keyType === "EMAIL" ? this.activeSettings.keyValue : null,
      keyEvp: this.activeSettings.keyType === "EVP" ? this.activeSettings.keyValue : null,
      keyPhone: this.activeSettings.keyType === "PHONE" ? this.activeSettings.keyValue : null,
    };
  }

  private constructor(
    private readonly config: {
      keyType: PaymentActiveSettings["keyType"];
      keyEmail: string | null;
      keyEvp: string | null;
      keyPhone: string | null;
    },
  ) { }
}
