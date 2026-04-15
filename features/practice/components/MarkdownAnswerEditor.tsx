"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/core";
import { cn } from "@/lib/utils";

// Dynamic import to avoid SSR issues
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="h-64 w-full rounded-xl" />
    ),
  }
);

interface MarkdownAnswerEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Markdown split editor for student answer input.
 * Write | Preview mode — no SSR.
 */
export function MarkdownAnswerEditor({
  value,
  onChange,
  placeholder = "Write your answer here... You can use Markdown formatting, equations (LaTeX), and step-by-step working.",
  disabled = false,
  className,
}: MarkdownAnswerEditorProps) {
  return (
    <div
      className={cn("rounded-xl overflow-hidden border border-border", className)}
      data-color-mode="dark"
    >
      <MDEditor
        value={value}
        onChange={(val) => onChange(val ?? "")}
        preview="live"
        height={320}
        visibleDragbar={false}
        textareaProps={{
          placeholder,
          disabled,
          id: "answer-editor",
          "aria-label": "Answer editor",
        }}
        style={{
          background: "oklch(0.10 0 0)",
          border: "none",
        }}
      />
    </div>
  );
}
