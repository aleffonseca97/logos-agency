"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function fetchNotifications() {
  const res = await fetch("/api/dashboard/notifications");
  if (!res.ok) throw new Error("Erro ao carregar notificações");
  return res.json() as Promise<{
    notifications: Array<{
      id: string;
      title: string;
      message: string;
      read: boolean;
      link: string | null;
      type: string;
      created_at: string;
    }>;
    unreadCount: number;
  }>;
}

export function useNotifications() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    refetchInterval: 60_000,
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch("/api/dashboard/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/dashboard/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  return {
    notifications: data?.notifications ?? [],
    unreadCount: data?.unreadCount ?? 0,
    markRead: (id: string) => markReadMutation.mutate(id),
    markAllRead: () => markAllMutation.mutate(),
  };
}

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/metrics");
      if (!res.ok) throw new Error("Erro ao carregar métricas");
      return res.json();
    },
  });
}

export function useLeads(params: {
  page: number;
  pageSize: number;
  search: string;
  status: string;
  sortOrder: "asc" | "desc";
}) {
  const qs = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    sortOrder: params.sortOrder,
    ...(params.search && { search: params.search }),
    ...(params.status && { status: params.status }),
  });

  return useQuery({
    queryKey: ["leads", params],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/leads?${qs}`);
      if (!res.ok) throw new Error("Erro ao carregar leads");
      return res.json();
    },
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/leads/${id}`);
      if (!res.ok) throw new Error("Lead não encontrado");
      return res.json();
    },
    enabled: Boolean(id),
  });
}
