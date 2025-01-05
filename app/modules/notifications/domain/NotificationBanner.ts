export interface NotificationBannerI {
  id: number;
  createdAt: Date;
  readAt: Date | null;

  data: {
    link: string | null;
    message: string;
    title: string;
  };
}
