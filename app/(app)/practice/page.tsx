"use client";

import { useState } from "react";
import { useChapters } from "@/features/practice/hooks/useChapters";
import { useTopics } from "@/features/practice/hooks/useTopics";
import { useQuestions } from "@/features/practice/hooks/useQuestions";
import { useCreateAttempt } from "@/features/practice/hooks/useAttempt";
import { QuestionCard } from "@/features/practice/components/QuestionCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Layers, AlertCircle, ArrowRight } from "lucide-react";
import type { QuestionSafe } from "@/shared/types/domain.types";
import type { Metadata } from "next";

export default function PracticePage() {
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionSafe | null>(null);

  const { data: chapters, isLoading: chaptersLoading } = useChapters();
  const { data: topics, isLoading: topicsLoading } = useTopics(selectedChapterId);
  const { data: questions, isLoading: questionsLoading } = useQuestions(selectedTopicId);
  const { mutate: createAttempt, isPending: isStarting } = useCreateAttempt();

  const handleChapterChange = (id: string) => {
    setSelectedChapterId(id);
    setSelectedTopicId(null);
    setSelectedQuestion(null);
  };

  const handleTopicChange = (id: string) => {
    setSelectedTopicId(id);
    setSelectedQuestion(null);
  };

  const handleStartPractice = (question: QuestionSafe) => {
    createAttempt({ question_id: question.id });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Practice</h1>
        <p className="text-muted-foreground">
          Select a chapter and topic, then choose a question to start practising.
        </p>
      </div>

      {/* Selector Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* Chapter Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <BookOpen className="w-4 h-4 text-primary" />
            Chapter
          </label>
          {chaptersLoading ? (
            <Skeleton className="h-10 w-full rounded-lg" />
          ) : (
            <Select
              value={selectedChapterId ?? ""}
              onValueChange={(val) => handleChapterChange(val!)}
            >
              <SelectTrigger
                id="chapter-select"
                className="bg-card border-border h-10"
              >
                <SelectValue placeholder="Select a chapter..." />
              </SelectTrigger>
              <SelectContent>
                {chapters?.map((ch) => (
                  <SelectItem key={ch.id} value={ch.id}>
                    <span className="text-xs text-muted-foreground mr-2">
                      Ch.{ch.order_index}
                    </span>
                    {ch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Topic Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <Layers className="w-4 h-4 text-primary" />
            Topic
          </label>
          {topicsLoading && selectedChapterId ? (
            <Skeleton className="h-10 w-full rounded-lg" />
          ) : (
            <Select
              value={selectedTopicId ?? ""}
              onValueChange={(val) => handleTopicChange(val!)}
              disabled={!selectedChapterId}
            >
              <SelectTrigger
                id="topic-select"
                className="bg-card border-border h-10 disabled:opacity-40"
              >
                <SelectValue placeholder={selectedChapterId ? "Select a topic..." : "Select a chapter first"} />
              </SelectTrigger>
              <SelectContent>
                {topics?.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      {(selectedChapterId || selectedTopicId) && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          {chapters?.find((c) => c.id === selectedChapterId)?.name && (
            <>
              <Badge variant="outline" className="text-xs">
                {chapters.find((c) => c.id === selectedChapterId)?.name}
              </Badge>
              {selectedTopicId && (
                <>
                  <ArrowRight className="w-3 h-3" />
                  <Badge variant="outline" className="text-xs">
                    {topics?.find((t) => t.id === selectedTopicId)?.name}
                  </Badge>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Questions List */}
      {selectedTopicId && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Questions
              {questions && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({questions.length})
                </span>
              )}
            </h2>
            {selectedQuestion && (
              <p className="text-xs text-primary">
                Click &quot;Start Practice&quot; to begin
              </p>
            )}
          </div>

          {questionsLoading ? (
            <div className="grid gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          ) : questions && questions.length > 0 ? (
            <div className="grid gap-3">
              {questions.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  isSelected={selectedQuestion?.id === q.id}
                  onSelect={setSelectedQuestion}
                  onStartPractice={handleStartPractice}
                  isStarting={isStarting}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircle className="w-10 h-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No questions available for this topic yet.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Check back soon — questions are added regularly.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty state when nothing selected */}
      {!selectedTopicId && !chaptersLoading && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <p className="text-muted-foreground font-medium">Select a chapter and topic to see questions</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            All Class 12 NCERT Mathematics topics are available
          </p>
        </div>
      )}
    </div>
  );
}
