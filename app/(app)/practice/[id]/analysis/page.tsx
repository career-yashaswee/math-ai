"use client";

import { useParams, useRouter } from "next/navigation";
import { useAnalysis } from "@/features/analysis/hooks/useAnalysis";
import { useAttempt } from "@/features/practice/hooks/useAttempt";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  ChevronRight,
  Trophy,
  Zap,
  Coins,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Lightbulb,
} from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { formatDuration } from "@/shared/utils/date";

function ScoreRing({ score }: { score: number }) {
  const pct = (score / 10) * 100;
  const color =
    score >= 8
      ? "text-green-400"
      : score >= 5
      ? "text-yellow-400"
      : "text-red-400";
  const label =
    score >= 8 ? "Excellent" : score >= 5 ? "Good" : "Needs Work";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18" cy="18" r="15.9"
            fill="none"
            stroke="oklch(0.17 0 0)"
            strokeWidth="2.5"
          />
          <circle
            cx="18" cy="18" r="15.9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray={`${pct} ${100 - pct}`}
            strokeLinecap="round"
            className={color}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold tabular-nums ${color}`}>
            {score.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">/10</span>
        </div>
      </div>
      <Badge
        variant="outline"
        className={`text-xs ${color} border-current/30 bg-current/5`}
      >
        {label}
      </Badge>
    </div>
  );
}

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.id as string;

  const { data: analysis, isLoading: analysisLoading } = useAnalysis(attemptId);
  const { data: attempt, isLoading: attemptLoading } = useAttempt(attemptId);

  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const isLoading = analysisLoading || attemptLoading;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Analysis not ready yet. Please wait a moment.</p>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const question = (attempt as any)?.questions;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Analysis Complete</h1>
          {question && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
              {question.title}
            </p>
          )}
        </div>
        <Button
          id="practice-again-btn"
          onClick={() => router.push("/practice")}
          variant="outline"
          className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-primary"
        >
          <RotateCcw className="w-4 h-4" />
          Practice Again
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Score */}
        <Card className="bg-card border-border col-span-1 flex items-center justify-center py-6">
          <ScoreRing score={analysis.final_score} />
        </Card>

        {/* Rewards */}
        <Card className="bg-card border-border col-span-1">
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Earned
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">+{analysis.xp_awarded}</p>
                <p className="text-xs text-muted-foreground">XP Points</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Coins className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">+{analysis.coins_awarded}</p>
                <p className="text-xs text-muted-foreground">Coins</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <Card className="bg-card border-border col-span-1">
          <CardContent className="pt-6 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Score Breakdown
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Keyword Match</span>
                <span className="font-mono font-medium">{analysis.exact_match_score.toFixed(1)}/10</span>
              </div>
              <Progress value={analysis.exact_match_score * 10} className="h-1.5" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">AI Score</span>
                <span className="font-mono font-medium">{analysis.gemini_score.toFixed(1)}/10</span>
              </div>
              <Progress value={analysis.gemini_score * 10} className="h-1.5" />
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Final Score</span>
              <span className="font-mono">{analysis.final_score.toFixed(1)}/10</span>
            </div>
            {attempt && (attempt as { time_taken_s?: number }).time_taken_s && (
              <p className="text-xs text-muted-foreground">
                Time: {formatDuration((attempt as { time_taken_s: number }).time_taken_s)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Approach Breakdown */}
      {analysis.approach_breakdown && (
        <Card className="bg-card border-border mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Approach Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="markdown-content prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{analysis.approach_breakdown}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback */}
      {analysis.feedback && (
        <Card className="bg-card border-border mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <XCircle className="w-5 h-5 text-yellow-400" />
              Feedback & Improvements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="markdown-content prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{analysis.feedback}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Correct Answer Reveal */}
      {analysis.correct_answer_hint && (
        <Card className="bg-card border-border mb-8">
          <button
            id="toggle-correct-answer-btn"
            onClick={() => setShowCorrectAnswer(!showCorrectAnswer)}
            className="w-full"
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Correct Approach
                </div>
                {showCorrectAnswer ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </CardTitle>
            </CardHeader>
          </button>
          {showCorrectAnswer && (
            <CardContent>
              <div className="markdown-content prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{analysis.correct_answer_hint}</ReactMarkdown>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Bottom CTA */}
      <div className="flex items-center justify-center gap-4">
        <Button
          id="go-to-dashboard-btn"
          variant="outline"
          onClick={() => router.push("/dashboard")}
          className="gap-2"
        >
          View Dashboard
        </Button>
        <Button
          id="practice-again-bottom-btn"
          onClick={() => router.push("/practice")}
          className="gap-2 green-glow-sm"
        >
          Practice Again
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
