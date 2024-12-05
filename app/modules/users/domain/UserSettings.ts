export interface UserSettingsI {
  timeZone: string | null;
  consents: {
    email: boolean | null;
    postMail: boolean | null;
    pushNotification: boolean | null;
    siteNotification: boolean | null;
    sms: boolean | null;
    telephone: boolean | null;
  };
  payment: {
    pixKeyEmail: string | null;
    pixKeyEvp: string | null;
    pixKeyPhone: string | null;
    pixKeyType: "CPF" | "EMAIL" | "PHONE" | "EVP" | null;
  };
}
