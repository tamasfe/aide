export type UserAccountJurisdiction = {
  code: Jurisdiction;
  name: string;
  currencies: string[];
};

export type UserAccount = {
  id: number;
  name: string;
  family_name: string;
  email: string;
  email_verified: boolean;
  phone: string;
  phone_verified: boolean;
  language: Language;
  jurisdiction: Jurisdiction;
  birthdate: string;
  gender: Gender | null;
  time_zone: string;
  blocked_until: string | null;
  excluded_until: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type UserAccountPhysicalAddress = {
  id: number;
  id_user_account: number;
  address_line1: string | null;
  address_line2: string | null;
  address_line3: string | null;
  city: string;
  state: string;
  postal_code: string | null;
  country: string;
  created_at: string;
  updated_at: string;
};

export type UserAccountAttribute = {
  id: number;
  id_user_account: number;
  key: string;
  value: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type UserAccountSetting = {
  id: number;
  id_user_account: number;
  key: string;
  value: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};
