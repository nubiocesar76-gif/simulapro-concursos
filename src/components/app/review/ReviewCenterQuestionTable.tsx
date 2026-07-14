import { Fragment, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { QuestionCard } from "@/components/app/study/QuestionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDashboardDate } from "@/lib/student-dashboard";
import type { ReviewCenterItem, ReviewTab } from "@/lib/review-center";
import { EmptyState } from "@/components/shared/EmptyState";

type ReviewCenterQuestionTableProps = {
  tab: ReviewTab;
  items: ReviewCenterItem[];
  total: number;
  page: number;
  pageSize: number;
  isUpdating?: boolean;
  onPageChange: (page: number) => void;
  onRespond: (item: ReviewCenterItem) => void;
  onRemoveFavorite: (item: ReviewCenterItem) => void;
  onRemoveReview: (item: ReviewCenterItem) => void;
};

function formatLastReview(value: string | null): string {
  if (!value) return "—";
  return formatDashboardDate(value);
}

export function ReviewCenterQuestionTable({
  tab,
  items,
  total,
  page,
  pageSize,
  isUpdating = false,
  onPageChange,
  onRespond,
  onRemoveFavorite,
  onRemoveReview,
}: ReviewCenterQuestionTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, total);

  return (
    <Card className="border-border/60 shadow-none">
      <CardHeader>
        <CardTitle className="text-base">Questões</CardTitle>
        <CardDescription>
          {total === 0 ? "Nenhuma questão nesta aba." : `${from}–${to} de ${total}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <EmptyState
            title="Nenhuma questão encontrada"
            description="Ajuste os filtros ou mude de aba para ver outras questões."
          />
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[10rem]">Questão</TableHead>
                    <TableHead className="min-w-[5rem]">Banca</TableHead>
                    <TableHead className="min-w-[4rem]">Ano</TableHead>
                    <TableHead className="min-w-[7rem]">Disciplina</TableHead>
                    <TableHead className="min-w-[7rem]">Assunto</TableHead>
                    <TableHead className="min-w-[5rem]">Última resp.</TableHead>
                    <TableHead className="min-w-[4rem] text-right">Erros</TableHead>
                    <TableHead className="min-w-[4rem] text-right">Acertos</TableHead>
                    <TableHead className="min-w-[6rem]">Última revisão</TableHead>
                    <TableHead className="min-w-[8rem] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <Fragment key={item.questionId}>
                      <TableRow>
                        <TableCell className="max-w-xs">
                          <p className="line-clamp-2 text-sm">{item.statementSummary}</p>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.boardName ?? "—"}
                        </TableCell>
                        <TableCell className="tabular-nums text-sm">{item.year ?? "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.subjectName ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.topicName ?? "—"}
                        </TableCell>
                        <TableCell className="tabular-nums text-sm">
                          {item.lastAnswer ?? "—"}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-sm">{item.errorCount}</TableCell>
                        <TableCell className="text-right tabular-nums text-sm">{item.correctCount}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatLastReview(item.lastReviewedAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div
                            className="flex flex-wrap items-center justify-end gap-1 sm:flex-col sm:items-end"
                            aria-busy={isUpdating}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isUpdating}
                              onClick={() => onRespond(item)}
                              aria-label={`Responder questão ${item.statementSummary.slice(0, 40)}`}
                            >
                              Responder
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setExpandedId((current) =>
                                  current === item.questionId ? null : item.questionId,
                                )
                              }
                              aria-expanded={expandedId === item.questionId}
                            >
                              {expandedId === item.questionId ? "Fechar" : "Abrir questão"}
                            </Button>
                            {tab === "favorites" && item.isFavorite && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-muted-foreground"
                                disabled={isUpdating}
                                onClick={() => onRemoveFavorite(item)}
                              >
                                Remover favorito
                              </Button>
                            )}
                            {tab === "review" && item.isReviewLater && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-muted-foreground"
                                disabled={isUpdating}
                                onClick={() => onRemoveReview(item)}
                              >
                                Remover revisão
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>

                      {expandedId === item.questionId && (
                        <TableRow>
                          <TableCell colSpan={10} className="bg-muted/30 p-0">
                            <Collapsible
                              open
                              onOpenChange={(open) => !open && setExpandedId(null)}
                            >
                              <CollapsibleContent>
                                <div className="space-y-3 p-4">
                                  <div className="flex flex-wrap gap-2">
                                    {item.isFavorite && <Badge variant="secondary">Favorita</Badge>}
                                    {item.isReviewLater && <Badge variant="secondary">Revisar</Badge>}
                                    {item.errorCount > 0 && (
                                      <Badge variant="destructive">{item.errorCount} erro(s)</Badge>
                                    )}
                                  </div>
                                  <QuestionCard statement={item.statement} />
                                  <div className="flex justify-end">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setExpandedId(null)}
                                    >
                                      <X className="h-4 w-4 mr-1.5" />
                                      Fechar
                                    </Button>
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-2 text-sm">
                <p className="text-muted-foreground tabular-nums">
                  Página {page + 1} de {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(0, page - 1))}
                    disabled={page <= 0}
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                    aria-label="Próxima página"
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
