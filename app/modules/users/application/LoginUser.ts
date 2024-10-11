import type { AuthenticationRepositoryI } from "../domain/AuthenticationRepository";

export class LoginUser {
  constructor(
    private authenticationRepository: AuthenticationRepositoryI,
  ) {}

  public async handle(
    username: string,
    password: string,
  ) {
    return this.authenticationRepository.login(username, password);
  }
}
