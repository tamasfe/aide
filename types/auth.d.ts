export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterCredentialsBrazil = {
  email: string;
  password: string;
  CPF: string;
  phone: string;
  phone_calling_code: string;
  national_phone_number: string;
};

export type SignupFlow = {
  id_flow: string;
};

export type Flow<T> = {
  id: string;
  fields: T;
  jurisdiction: string;
};
