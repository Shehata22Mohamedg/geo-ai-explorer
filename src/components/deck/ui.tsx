import type { ReactNode } from "react";
import type { AccentKey } from "@/data/deck/types";

export const accentText: Record<AccentKey, string> = {
  oxy: "text-oxy",
  ochre: "text-ochre",
  moss: "text-moss",
  slate: "text-slate",
};

export const accentBg: Record<AccentKey, string> = {
  oxy: "bg-oxy",
  ochre: "bg-ochre",
  moss: "bg-moss",
  slate: "bg-slate",
};

export const accentSoft: Record<AccentKey, string> = {
  oxy: "bg-oxy/10",
  ochre: "bg-ochre/10",
  moss: "bg-moss/10",
  slate: "bg-slate/10",
};

export const accentBorder: Record<AccentKey, string> = {
  oxy: "border-oxy/40",
  ochre: "border-ochre/40",
  moss: "border-moss/40",
  slate: "border-slate/40",
};

export const accentStroke: Record<AccentKey, string> = {
  oxy: "var(--oxy)",
  ochre: "var(--ochre)",
  moss: "var(--moss)",
  slate: "var(--slate)",
};

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-inksoft">{children}</p>
  );
}

export function Chip({
  children,
  accent = "oxy",
}: {
  children: ReactNode;
  accent?: AccentKey;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-bold tracking-wide ${accentSoft[accent]} ${accentText[accent]}`}
    >
      {children}
    </span>
  );
}

export function Panel({
  children,
  className = "",
  label,
  right,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
  right?: ReactNode;
}) {
  return (
    <div className={`rounded-xl bg-paper/70 p-4 ring-1 ring-black/5 ${className}`}>
      {(label || right) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {label ? <Kicker>{label}</Kicker> : <span />}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

export function Btn({
  children,
  onClick,
  active,
  disabled,
  tone = "ink",
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  tone?: "ink" | "quiet" | "oxy";
}) {
  const base =
    "rounded-md px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const tones = {
    ink: active ? "bg-ink text-paper" : "border border-line bg-card text-ink hover:bg-paper",
    quiet: active
      ? "bg-inksoft text-paper"
      : "border border-line bg-card text-inksoft hover:text-ink",
    oxy: active ? "bg-oxy text-paper" : "border border-oxy/40 bg-card text-oxy hover:bg-oxy/10",
  } as const;
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${tones[tone]}`}>
      {children}
    </button>
  );
}

export function Bar({
  value,
  max = 1,
  accent = "oxy",
  label,
  right,
}: {
  value: number;
  max?: number;
  accent?: AccentKey;
  label: string;
  right?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-semibold text-ink">{label}</span>
        {right && <span className="font-mono text-[11px] text-inksoft">{right}</span>}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-line">
        <div
          className={`h-full rounded-full ${accentBg[accent]} transition-[width] duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function Reveal({ children, show }: { children: ReactNode; show: boolean }) {
  if (!show) return null;
  return <div className="stratum-in">{children}</div>;
}
