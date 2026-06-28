import { api } from "../client"
import type { Announcement, Notification } from "@/types"

export const ENDPOINTS = {
  announcements: {
    base: "/notifications",
  },
  notifications: {
    base: "/me/notifications",
    read: (id: string) => `/me/notifications/${id}/read`,
  },
}

export const announcementApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : ""
    return api.get<Announcement[]>(`${ENDPOINTS.announcements.base}${qs}`)
  },
  create: (body: unknown) => api.post<Announcement>(ENDPOINTS.announcements.base, body),
}

export const notificationApi = {
  list: (unreadOnly = false) => {
    const qs = unreadOnly ? "?unread=true" : ""
    return api.get<Notification[]>(`${ENDPOINTS.notifications.base}${qs}`)
  },
  markRead: (id: string) => api.patch<void>(ENDPOINTS.notifications.read(id), {}),
  // Mark all notifications read by iterating — backend has no bulk endpoint yet
  markAllRead: async () => {
    // Fetch unread IDs then mark each — best-effort, ignores individual failures
    try {
      const items = await api.get<Notification[]>(
        `${ENDPOINTS.notifications.base}?unread=true`,
      )
      const list = Array.isArray(items) ? items : []
      await Promise.allSettled(
        list.map((n) =>
          api.patch<void>(ENDPOINTS.notifications.read(String(n.id)), {}),
        ),
      )
    } catch {
      // Silently swallow — not critical
    }
  },
}
