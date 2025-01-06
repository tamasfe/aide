export type NotificationToast = {
  id: number;
  createdAt: Date;
  variant: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
};
