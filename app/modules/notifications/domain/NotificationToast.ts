export type NotificationToast = {
  id: number;

  variant: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
};
