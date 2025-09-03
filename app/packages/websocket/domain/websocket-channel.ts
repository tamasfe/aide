/**
 * Open to everybody to enter
 */
export type WebsocketOpenChannel = "newest_wins";

/**
 * They need the user to be logged in
 */
export type WebsocketUserChannel = "user" | "tracker";

export type WebsocketChannel = WebsocketOpenChannel | WebsocketUserChannel;
