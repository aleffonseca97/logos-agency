"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addDays,
  addMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/logos/button";
import { Input } from "@/components/logos/input";
import { EVENT_TYPES, type CalendarView } from "@/types/event";
import { useToast } from "@/components/logos/toast";
import { cn } from "@/lib/utils";

export function AgendaPage() {
  const [view, setView] = useState<CalendarView>("month");
  const [current, setCurrent] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const rangeStart = view === "month"
    ? startOfMonth(current)
    : view === "week"
      ? startOfWeek(current, { locale: ptBR })
      : current;
  const rangeEnd = view === "month"
    ? endOfMonth(current)
    : view === "week"
      ? endOfWeek(current, { locale: ptBR })
      : current;

  const { data: events = [] } = useQuery({
    queryKey: ["events", rangeStart.toISOString(), rangeEnd.toISOString()],
    queryFn: async () => {
      const qs = new URLSearchParams({
        start: rangeStart.toISOString(),
        end: addDays(rangeEnd, 1).toISOString(),
      });
      const res = await fetch(`/api/dashboard/events?${qs}`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const createEvent = useMutation({
    mutationFn: async (body: Record<string, string>) => {
      const res = await fetch("/api/dashboard/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Erro ao criar evento");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setShowForm(false);
      toast({ variant: "success", title: "Evento criado" });
    },
  });

  const days = view === "month"
    ? eachDayOfInterval({ start: startOfWeek(startOfMonth(current)), end: endOfWeek(endOfMonth(current)) })
    : view === "week"
      ? eachDayOfInterval({ start: startOfWeek(current), end: endOfWeek(current) })
      : [current];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda"
        description="Reuniões, ligações e follow-ups. Integração Google Calendar preparada."
        actions={
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="size-4" aria-hidden />
            Novo evento
          </Button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={() => setCurrent(addMonths(current, -1))}>
            <ChevronLeft className="size-4" aria-hidden />
          </Button>
          <h2 className="text-logos-text min-w-[160px] text-center font-semibold capitalize">
            {format(current, view === "day" ? "dd MMMM yyyy" : "MMMM yyyy", { locale: ptBR })}
          </h2>
          <Button variant="ghost" size="icon-sm" onClick={() => setCurrent(addMonths(current, 1))}>
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
        <div className="flex gap-2">
          {(["month", "week", "day"] as CalendarView[]).map((v) => (
            <Button
              key={v}
              size="sm"
              variant={view === v ? "primary" : "outline"}
              onClick={() => setView(v)}
            >
              {v === "month" ? "Mensal" : v === "week" ? "Semanal" : "Diário"}
            </Button>
          ))}
        </div>
      </div>

      {showForm && (
        <EventForm
          onSubmit={(data) => createEvent.mutate(data)}
          onCancel={() => setShowForm(false)}
          loading={createEvent.isPending}
        />
      )}

      <div className={cn("logos-glass rounded-xl p-4", view === "month" && "grid grid-cols-7 gap-1")}>
        {view === "month" &&
          ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
            <div key={d} className="text-logos-text-muted py-2 text-center text-xs font-medium">
              {d}
            </div>
          ))}
        {days.map((day) => {
          const dayEvents = events.filter((e: { start_at: string }) =>
            isSameDay(new Date(e.start_at), day),
          );
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[80px] rounded-lg border border-transparent p-2",
                view === "month" && !isSameMonth(day, current) && "opacity-40",
                isSameDay(day, new Date()) && "border-brand-primary/40 bg-brand-primary/5",
              )}
            >
              <p className="text-logos-text-muted mb-1 text-xs">{format(day, "d")}</p>
              {dayEvents.map((e: { id: string; title: string; type: string }) => (
                <div
                  key={e.id}
                  className="bg-brand-primary/20 text-brand-primary mb-1 truncate rounded px-1.5 py-0.5 text-[10px] font-medium"
                >
                  {e.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <p className="text-logos-text-muted text-xs">
        Campo <code className="text-brand-primary">google_calendar_id</code> preparado para sincronização futura.
      </p>
    </div>
  );
}

function EventForm({
  onSubmit,
  onCancel,
  loading,
}: {
  onSubmit: (data: Record<string, string>) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("meeting");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  return (
    <div className="logos-glass space-y-4 rounded-xl p-6">
      <h3 className="text-logos-text font-semibold">Novo evento</h3>
      <Input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border-logos-border bg-logos-surface text-logos-text h-10 w-full rounded-lg border px-3 text-sm"
      >
        {EVENT_TYPES.map((t) => (
          <option key={t} value={t}>
            {t === "meeting" ? "Reunião" : t === "call" ? "Ligação" : "Follow-up"}
          </option>
        ))}
      </select>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
        <Input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <Button
          disabled={!title || !start || !end || loading}
          onClick={() =>
            onSubmit({
              title,
              type,
              start_at: new Date(start).toISOString(),
              end_at: new Date(end).toISOString(),
            })
          }
        >
          Salvar
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
