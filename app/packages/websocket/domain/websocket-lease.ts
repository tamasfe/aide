import type { WebsocketChannel } from "./websocket-channel";

type WebsocketLeaseProps = {
  token: string;
  channel: WebsocketChannel;
};

export class WebsocketLease {
  public static new(props: WebsocketLeaseProps): WebsocketLease {
    return new WebsocketLease(props.token, props.channel);
  }

  public toJSON(): WebsocketLeaseProps {
    return {
      token: this.token,
      channel: this.channel,
    };
  }

  private constructor(
    public readonly token: string,
    public readonly channel: WebsocketChannel,
  ) {}
}
