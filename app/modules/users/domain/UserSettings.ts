import { UserSettingsPaymentPix, type UserSettingsPaymentPixPropsI } from "./UserSettingsPaymentPix";
import type { SupportedLocale } from "~/packages/translation";

export interface UserSettingsPropsI {
  timeZone: string | null;
  locale: SupportedLocale | null;
  consents: {
    email: boolean | null;
    postMail: boolean | null;
    pushNotification: boolean | null;
    siteNotification: boolean | null;
    sms: boolean | null;
    telephone: boolean | null;
  };
  payment: UserSettingsPaymentPixPropsI;
}

export class UserSettings {
  public static simplifiedToConsentsProps(consents: {
    email?: boolean | null;
    phone?: boolean | null;
    browser?: boolean | null;
  }): Partial<UserSettingsPropsI["consents"]> {
    const partialConsents: Partial<UserSettingsPropsI["consents"]> = {};
    if (consents.email !== undefined) {
      partialConsents.email = consents.email;
      partialConsents.postMail = consents.email;
    }
    if (consents.phone !== undefined) {
      partialConsents.telephone = consents.phone;
      partialConsents.sms = consents.phone;
    }
    if (consents.browser !== undefined) {
      partialConsents.pushNotification = consents.browser;
      partialConsents.siteNotification = consents.browser;
    }
    return partialConsents;
  }

  public static new(props: UserSettingsPropsI) {
    return new UserSettings(props);
  }

  public get payment(): UserSettingsPaymentPix {
    return UserSettingsPaymentPix.new(this.props.payment);
  }

  public get simplifiedConsents() {
    return {
      email: this.props.consents.email,
      phone: this.props.consents.sms,
      browser: this.props.consents.pushNotification,
    };
  }

  public toJSON(): UserSettingsPropsI {
    return {
      ...this.props,
    };
  }

  private constructor(private props: UserSettingsPropsI) {

  }
}
