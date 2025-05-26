import { CustomError } from "../result";

export class ErrorAnjouanLicenseScriptWasNotFound extends CustomError {
  public name = "ErrorAnjouanLicenseScriptWasNotFound" as const;
}
