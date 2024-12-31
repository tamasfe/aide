export type NotificationType = 'banner'

export interface NotificationPropsI {
  id: number
  createdAt: string
  readAt: string | null

  type: NotificationType
  data: {
    link: string | null
    message: string
    title: string
  }
}

export interface NotificationI {
  id: number
  createdAt: Date
  readAt: Date | null

  type: NotificationType
  data: {
    link: string | null
    message: string
    title: string
  }
}
