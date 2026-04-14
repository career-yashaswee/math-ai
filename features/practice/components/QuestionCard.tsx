"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Lightbulb, BookOpen, ChevronRight, Clock } from "lucide-react";
import { useState } from "react";
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS, type QuestionSafe } from "@/shared/types/domain.types";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: QuestionSafe;
  isSelected?: boolean;
  onSelect: (question: QuestionSafe) => void;
  onStartPractice?: (question: QuestionSafe) => void;
  isStarting?: boolean;
}

const DIFFICULTY_BADGE_COLORS = {
  easy: "bg-green-500/10 text-green-400 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  hard: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function QuestionCard({
  question,
  isSelected,
  onSelect,
  onStartPractice,
  isStarting,
}: QuestionCardProps) {
  const [showHint, setShowHint] = useState(false);

  return (
    <Card
      id={`question-card-${question.id}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(question)}
      onKeyDown={(e) => e.key === "Enter" && onSelect(question)}
      className={cn(
        "cursor-pointer transition-all duration-200 border",
        "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
        isSelected
          ? "border-primary/60 bg-primary/5 green-glow-sm"
          : "border-border bg-card"
      )}
    >
      <CardContent className="pt-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-medium",
                DIFFICULTY_BADGE_COLORS[question.difficulty]
              )}
            >
              {DIFFICULTY_LABELS[question.difficulty]}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {question.marks} marks
            </span>
          </div>
          {isSelected && (
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
          )}
        </div>

        <h3 className="text-sm font-semibold text-foreground leading-snug mb-2 line-clamp-2">
          {question.title}
        </h3>

        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {question.body.replace(/#{1,6}\s/g, "").replace(/\*\*/g, "")}
        </p>

        {/* Hint toggle */}
        {question.hint && (
          <div className="mt-3">
            <button
              onClick={(e) => { e.stopPropagation(); setShowHint(!showHint); }}
              className="flex items-center gap-1.5 text-xs text-yellow-500/80 hover:text-yellow-400 transition-colors"
            >
              <Lightbulb className="w-3 h-3" />
              {showHint ? "Hide hint" : "Show hint"}
            </button>
            {showHint && (
              <p className="mt-2 text-xs text-yellow-400/70 bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-2.5 leading-relaxed">
                💡 {question.hint}
              </p>
            )}
          </div>
        )}
      </CardContent>

      {isSelected && onStartPractice && (
        <CardFooter className="pt-0 pb-4 px-4">
          <Button
            id={`start-practice-btn-${question.id}`}
            onClick={(e) => { e.stopPropagation(); onStartPractice(question); }}
            disabled={isStarting}
            className="w-full h-9 text-sm font-semibold gap-2 green-glow-sm"
          >
            {isStarting ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                Start Practice
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
