import type { WebsocketUserChannel } from "./websocket-channel";

type WebsocketAccessTokenProps = {
  token: string;
  channel: WebsocketUserChannel;
};

export class WebsocketAccessToken {
  public static newUserToken(token: string): WebsocketAccessToken {
    return new WebsocketAccessToken(token, "user");
  }

  public toJSON(): WebsocketAccessTokenProps {
    return {
      token: this.token,
      channel: this.channel,
    };
  }

  private constructor(
    public readonly token: string,
    public readonly channel: WebsocketUserChannel,
  ) {}
}
