declare interface IInputFieldRule {
  value: boolean;
  regex?: string;
  message: string;
}

declare interface IInputFieldRulesList {
  regex?: IInputFieldRule;
  required: IInputFieldRule;
}

declare interface IInputField {
  label: string;
  type: string;
  value: string;
  invalid: boolean;
  rules: IInputFieldRulesList;
  errors: string[];
}