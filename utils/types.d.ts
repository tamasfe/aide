export type CountryCode = {
  name: string;
  code: string;
  dial_code: string;
};

export type FormatNumberOptions = {
  currency?: string;
  decimalPlaces?: number;
  locale: string;
};

export type IntlConfig = {
  locale: string;
  currency?: string;
};

export type CurrencyInput = {
  /**
   * Allow decimals
   *
   * Default = true
   */
  allowDecimals?: boolean;

  /**
   * Allow user to enter negative value
   *
   * Default = true
   */
  allowNegativeValue?: boolean;

  /**
   * Component id
   */
  id?: string;

  /**
   *  Maximum characters the user can enter
   */
  maxLength?: number;

  /**
   * Class names
   */
  className?: string;

  /**
   * Custom component
   *
   * Default = <input/>
   */
  customInput?: ElementType;

  /**
   * Limit length of decimals allowed
   *
   * Default = 2
   */
  decimalsLimit?: number;

  /**
   * Specify decimal scale for padding/trimming
   *
   * Example:
   *   1.5 -> 1.50
   *   1.234 -> 1.23
   */
  decimalScale?: number;

  /**
   * Default value if not passing in value via props
   */
  defaultValue?: number | string;

  /**
   * Disabled
   *
   * Default = false
   */
  disabled?: boolean;

  /**
   * Value will always have the specified length of decimals
   *
   * Example:
   *   123 -> 1.23
   *
   * Note: This formatting only happens onBlur
   */
  fixedDecimalLength?: number;

  /**
   * Handle change in value
   */
  onValueChange?: (
    value: string | undefined,
    name?: string,
    values?: CurrencyInputOnChangeValues,
  ) => void;

  /**
   * Placeholder if there is no value
   */
  placeholder?: string;

  /**
   * Include a prefix eg. £
   */
  prefix?: string;

  /**
   * Include a suffix eg. €
   */
  suffix?: string;

  /**
   * Incremental value change on arrow down and arrow up key press
   */
  step?: number;

  /**
   * Separator between integer part and fractional part of value.
   *
   * This cannot be a number
   */
  decimalSeparator?: string;

  /**
   * Separator between thousand, million and billion
   *
   * This cannot be a number
   */
  groupSeparator?: string;

  /**
   * Disable auto adding separator between values eg. 1000 -> 1,000
   *
   * Default = false
   */
  disableGroupSeparators?: boolean;

  /**
   * Disable abbreviations (m, k, b)
   *
   * Default = false
   */
  disableAbbreviations?: boolean;

  /**
   * International locale config, examples:
   *   { locale: 'ja-JP', currency: 'JPY' }
   *   { locale: 'en-IN', currency: 'INR' }
   *
   * Any prefix, groupSeparator or decimalSeparator options passed in
   * will override Intl Locale config
   */
  intlConfig?: IntlConfig;

  /**
   * Transform the raw value form the input before parsing
   */
  transformRawValue?: (rawValue: string) => string;

  /**
   * When set to false, the formatValueOnBlur flag disables the application of the __onValueChange__ function
   * specifically on blur events. If disabled or set to false, the onValueChange will not trigger on blur.
   * Default = true
   */
  formatValueOnBlur?: boolean;
};
