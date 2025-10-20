export type NotificationToast = {
  id: number | string;
  createdAt: Date;
  variant: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
};
