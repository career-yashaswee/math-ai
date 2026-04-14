"use client";

import { useState, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useQuestion } from "@/features/practice/hooks/useQuestions";
import { useSubmitAttempt } from "@/features/practice/hooks/useAttempt";
import { MarkdownAnswerEditor } from "@/features/practice/components/MarkdownAnswerEditor";
import { PracticeTimer, getElapsedSeconds } from "@/features/practice/components/PracticeTimer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Send, AlertTriangle, BookOpen } from "lucide-react";
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from "@/shared/types/domain.types";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

const DIFFICULTY_BADGE_COLORS = {
  easy: "bg-green-500/10 text-green-400 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  hard: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AttemptPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const questionId = params.questionId as string;
  const attemptId = searchParams.get("attemptId") ?? "";

  const { data: question, isLoading } = useQuestion(questionId);
  const { mutate: submitAttempt, isPending: isSubmitting } = useSubmitAttempt(attemptId);

  const [answer, setAnswer] = useState("");
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const startedAt = useRef(new Date());

  const handleSubmit = () => {
    if (!answer.trim()) return;
    const timeTakenS = getElapsedSeconds(startedAt.current);
    submitAttempt({ student_answer: answer, time_taken_s: timeTakenS });
  };

  const handleBack = () => {
    if (answer.trim()) {
      setShowLeaveDialog(true);
    } else {
      router.push("/practice");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Question not found.</p>
        <Link href="/practice" className="text-primary text-sm mt-4 inline-block">
          ← Back to Practice
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Practice
        </button>
        <PracticeTimer startedAt={startedAt.current} />
      </div>

      {/* Question Card */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={DIFFICULTY_BADGE_COLORS[question.difficulty]}
            >
              {DIFFICULTY_LABELS[question.difficulty]}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {question.marks} marks
            </span>
          </div>
        </div>

        <h1 className="text-xl font-bold mb-4 leading-snug">{question.title}</h1>
        <Separator className="mb-4" />

        <div className="markdown-content prose prose-invert prose-sm max-w-none">
          <ReactMarkdown>{question.body}</ReactMarkdown>
        </div>
      </div>

      {/* Answer Section */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <h2 className="text-base font-semibold mb-1 flex items-center gap-2">
          Your Answer
          <span className="text-xs font-normal text-muted-foreground">
            — Markdown supported
          </span>
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Show your complete working. You can use **bold**, equations, bullet points, and step-by-step notation.
        </p>

        <MarkdownAnswerEditor
          value={answer}
          onChange={setAnswer}
          disabled={isSubmitting}
        />

        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground">
            {answer.trim().length} characters
          </p>
          <Button
            id="submit-answer-btn"
            onClick={handleSubmit}
            disabled={!answer.trim() || isSubmitting}
            className="gap-2 green-glow-sm"
          >
            {isSubmitting ? (
              <>
                <span className="animate-pulse">Analysing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Answer
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Leave Confirmation Dialog */}
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Leave this attempt?
            </DialogTitle>
            <DialogDescription>
              Your answer will be lost if you leave now. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLeaveDialog(false)}>
              Stay
            </Button>
            <Button
              variant="destructive"
              onClick={() => router.push("/practice")}
            >
              Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
