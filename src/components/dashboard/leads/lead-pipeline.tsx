"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { LEAD_PIPELINE } from "@/types/lead";
import type { LeadWithAssignee } from "@/types/lead";
import { cn } from "@/lib/utils";

type PipelineProps = {
  leads: LeadWithAssignee[];
};

export function LeadPipeline({ leads }: PipelineProps) {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/dashboard/leads/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as string;

    if (LEAD_PIPELINE.includes(newStatus as (typeof LEAD_PIPELINE)[number])) {
      const lead = leads.find((l) => l.id === leadId);
      if (lead && lead.status !== newStatus) {
        updateStatus.mutate({ id: leadId, status: newStatus });
      }
    }
  };

  const activeLead = leads.find((l) => l.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(e) => setActiveId(e.active.id as string)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {LEAD_PIPELINE.map((status) => (
          <PipelineColumn
            key={status}
            status={status}
            leads={leads.filter((l) => l.status === status)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeLead ? <LeadCard lead={activeLead} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function PipelineColumn({
  status,
  leads,
}: {
  status: string;
  leads: LeadWithAssignee[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "bg-logos-surface/30 flex w-72 shrink-0 flex-col rounded-xl border border-logos-border transition-colors",
        isOver && "border-brand-primary/50 bg-brand-primary/5",
      )}
    >
      <div className="border-logos-border border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-logos-text text-sm font-semibold">{status}</h3>
          <span className="text-logos-text-muted bg-logos-surface rounded-full px-2 py-0.5 text-xs">
            {leads.length}
          </span>
        </div>
      </div>
      <div className="flex min-h-[200px] flex-1 flex-col gap-2 p-3">
        {leads.map((lead) => (
          <DraggableLeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}

function DraggableLeadCard({ lead }: { lead: LeadWithAssignee }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: lead.id });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(isDragging && "opacity-40")}
    >
      <LeadCard lead={lead} />
    </div>
  );
}

function LeadCard({
  lead,
  isDragging,
}: {
  lead: LeadWithAssignee;
  isDragging?: boolean;
}) {
  return (
    <div
      className={cn(
        "logos-glass cursor-grab rounded-lg p-3 transition-shadow active:cursor-grabbing",
        isDragging && "shadow-logos-glow",
      )}
    >
      <p className="text-logos-text text-sm font-medium">{lead.name}</p>
      <p className="text-logos-text-muted mt-0.5 text-xs">{lead.company}</p>
      <p className="text-logos-text-muted mt-2 text-xs">{lead.project_type}</p>
    </div>
  );
}
