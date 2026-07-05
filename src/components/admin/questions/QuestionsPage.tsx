import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { logEvent } from "@/lib/log";
import {
  buildQuestionMetadata,
  DIFFICULTY_OPTIONS,
  formatQuestionError,
  parseAlternativesFromDb,
  parseMetadataFields,
  validateQuestionInput,
  type QuestionAlternative,
  type QuestionMetadataFields,
} from "@/lib/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  TAXONOMY_PAGE_SIZE,
  formatDate,
  TaxonomyPagination,
  TaxonomySearch,
  type DeleteDep,
  hasDeleteDeps,
} from "@/components/admin/taxonomy/shared";

type QuestionRow = Tables<"questions"> & {
  subjects: { name: string } | null;
  topics: { name: string } | null;
  boards: { name: string } | null;
  exams: { name: string } | null;
  positions: { name: string; course_id: string } | null;
};

const ALL = "__all__";

type Filters = {
  course: string;
  position: string;
  board: string;
  exam: string;
  subject: string;
  topic: string;
  year: string;
  difficulty: string;
};

const EMPTY_FILTERS: Filters = {
  course: ALL,
  position: ALL,
  board: ALL,
  exam: ALL,
  subject: ALL,
  topic: ALL,
  year: "",
  difficulty: ALL,
};

type FormState = {
  statement: string;
  alternatives: QuestionAlternative[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  year: string;
  subjectId: string;
  topicId: string;
  boardId: string;
  examId: string;
  positionId: string;
  metadata: QuestionMetadataFields;
};

function emptyForm(): FormState {
  return {
    statement: "",
    alternatives: [
      { letter: "A", text: "" },
      { letter: "B", text: "" },
      { letter: "C", text: "" },
      { letter: "D", text: "" },
    ],
    correctAnswer: "",
    explanation: "",
    difficulty: "",
    year: "",
    subjectId: "",
    topicId: "",
    boardId: "",
    examId: "",
    positionId: "",
    metadata: { image_url: "", bibliography: "", legal_reference: "" },
  };
}

function rowToForm(row: QuestionRow): FormState {
  return {
    statement: row.statement,
    alternatives: parseAlternativesFromDb(row.alternatives),
    correctAnswer: row.correct_answer ?? "",
    explanation: row.explanation ?? "",
    difficulty: row.difficulty ?? "",
    year: row.year != null ? String(row.year) : "",
    subjectId: row.subject_id ?? "",
    topicId: row.topic_id ?? "",
    boardId: row.board_id ?? "",
    examId: row.exam_id ?? "",
    positionId: row.position_id ?? "",
    metadata: parseMetadataFields(row.metadata),
  };
}

async function fetchQuestionDeps(questionId: string): Promise<DeleteDep[]> {
  const [attempts, favorites] = await Promise.all([
    supabase.from("question_attempts").select("*", { count: "exact", head: true }).eq("question_id", questionId),
    supabase.from("favorites").select("*", { count: "exact", head: true }).eq("question_id", questionId),
  ]);
  return [
    { label: "tentativa(s) de aluno(s)", count: attempts.count ?? 0 },
    { label: "favorito(s) de aluno(s)", count: favorites.count ?? 0 },
  ];
}

function buildPayload(form: FormState) {
  const validated = validateQuestionInput({
    statement: form.statement,
    alternatives: form.alternatives,
    correctAnswer: form.correctAnswer,
    year: form.year,
  });

  return {
    statement: validated.statement,
    alternatives: validated.alternatives,
    correct_answer: validated.correctAnswer,
    explanation: form.explanation.trim() || null,
    difficulty: form.difficulty || null,
    year: validated.year,
    subject_id: form.subjectId || null,
    topic_id: form.topicId || null,
    board_id: form.boardId || null,
    exam_id: form.examId || null,
    position_id: form.positionId || null,
    metadata: buildQuestionMetadata(form.metadata),
  };
}

function hasActiveFilters(filters: Filters, debouncedSearch: string) {
  return (
    !!debouncedSearch ||
    filters.course !== ALL ||
    filters.position !== ALL ||
    filters.board !== ALL ||
    filters.exam !== ALL ||
    filters.subject !== ALL ||
    filters.topic !== ALL ||
    !!filters.year ||
    filters.difficulty !== ALL
  );
}

export function QuestionsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<QuestionRow | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<QuestionRow | null>(null);
  const [deleteDeps, setDeleteDeps] = useState<DeleteDep[] | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(0);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  function updateFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "course") next.position = ALL;
      if (key === "board") next.exam = ALL;
      if (key === "subject") next.topic = ALL;
      return next;
    });
    setPage(0);
  }

  const { data: courses = [] } = useQuery({
    queryKey: ["courses", "options"],
    queryFn: async () => (await supabase.from("courses").select("id,name").order("name")).data ?? [],
  });

  const { data: positions = [] } = useQuery({
    queryKey: ["positions", "options", filters.course],
    queryFn: async () => {
      let q = supabase.from("positions").select("id,name,course_id").order("name");
      if (filters.course !== ALL) q = q.eq("course_id", filters.course);
      return (await q).data ?? [];
    },
  });

  const { data: boards = [] } = useQuery({
    queryKey: ["boards", "options"],
    queryFn: async () => (await supabase.from("boards").select("id,name").order("name")).data ?? [],
  });

  const { data: exams = [] } = useQuery({
    queryKey: ["exams", "options", filters.board],
    queryFn: async () => {
      let q = supabase.from("exams").select("id,name,board_id").order("name");
      if (filters.board !== ALL) q = q.eq("board_id", filters.board);
      return (await q).data ?? [];
    },
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects", "options"],
    queryFn: async () => (await supabase.from("subjects").select("id,name").order("name")).data ?? [],
  });

  const { data: topics = [] } = useQuery({
    queryKey: ["topics", "options", filters.subject],
    queryFn: async () => {
      let q = supabase.from("topics").select("id,name,subject_id").order("name");
      if (filters.subject !== ALL) q = q.eq("subject_id", filters.subject);
      return (await q).data ?? [];
    },
  });

  const { data: formPositions = [] } = useQuery({
    queryKey: ["positions", "form-options"],
    queryFn: async () => (await supabase.from("positions").select("id,name,course_id").order("name")).data ?? [],
  });

  const { data: formExams = [] } = useQuery({
    queryKey: ["exams", "form-options", form.boardId],
    queryFn: async () => {
      let q = supabase.from("exams").select("id,name").order("name");
      if (form.boardId) q = q.eq("board_id", form.boardId);
      return (await q).data ?? [];
    },
  });

  const { data: formTopics = [] } = useQuery({
    queryKey: ["topics", "form-options", form.subjectId],
    queryFn: async () => {
      let q = supabase.from("topics").select("id,name").order("name");
      if (form.subjectId) q = q.eq("subject_id", form.subjectId);
      return (await q).data ?? [];
    },
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["questions", debouncedSearch, page, filters],
    queryFn: async () => {
      const from = page * TAXONOMY_PAGE_SIZE;
      const to = from + TAXONOMY_PAGE_SIZE - 1;

      let q = supabase
        .from("questions")
        .select(
          `id, statement, year, difficulty, correct_answer, explanation, alternatives, metadata,
           subject_id, topic_id, board_id, exam_id, position_id, created_at,
           subjects(name), topics(name), boards(name), exams(name), positions(name, course_id)`,
          { count: "exact" },
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (debouncedSearch) q = q.ilike("statement", `%${debouncedSearch}%`);
      if (filters.position !== ALL) q = q.eq("position_id", filters.position);
      if (filters.board !== ALL) q = q.eq("board_id", filters.board);
      if (filters.exam !== ALL) q = q.eq("exam_id", filters.exam);
      if (filters.subject !== ALL) q = q.eq("subject_id", filters.subject);
      if (filters.topic !== ALL) q = q.eq("topic_id", filters.topic);
      if (filters.year) q = q.eq("year", Number(filters.year));
      if (filters.difficulty !== ALL) q = q.eq("difficulty", filters.difficulty);

      if (filters.course !== ALL) {
        const { data: coursePositions } = await supabase
          .from("positions")
          .select("id")
          .eq("course_id", filters.course);
        const ids = (coursePositions ?? []).map((p) => p.id);
        if (ids.length === 0) return { rows: [] as QuestionRow[], total: 0 };
        q = q.in("position_id", ids);
      }

      const { data: rows, error: qError, count } = await q;
      if (qError) throw qError;
      return { rows: (rows ?? []) as QuestionRow[], total: count ?? 0 };
    },
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  const save = useMutation({
    mutationFn: async () => {
      const payload = buildPayload(form);

      if (editing?.id) {
        const { error: updateError } = await supabase.from("questions").update(payload).eq("id", editing.id);
        if (updateError) throw updateError;
        await logEvent("question.update", "questions", editing.id, { statement: payload.statement.slice(0, 80) });
        return editing.id;
      }

      const { data: created, error: insertError } = await supabase
        .from("questions")
        .insert(payload)
        .select("id")
        .single();
      if (insertError) throw insertError;
      await logEvent("question.create", "questions", created.id, { statement: payload.statement.slice(0, 80) });
      return created.id;
    },
    onSuccess: () => {
      toast.success(editing ? "Questão atualizada." : "Questão criada.");
      qc.invalidateQueries({ queryKey: ["questions"] });
      setDialogOpen(false);
      setEditing(null);
      setForm(emptyForm());
    },
    onError: (e: Error) => toast.error(formatQuestionError(e.message)),
  });

  const remove = useMutation({
    mutationFn: async (row: QuestionRow) => {
      const deps = await fetchQuestionDeps(row.id);
      if (hasDeleteDeps(deps)) {
        throw new Error("Não é possível excluir: existem tentativas ou favoritos de alunos vinculados.");
      }
      const { error: deleteError } = await supabase.from("questions").delete().eq("id", row.id);
      if (deleteError) throw deleteError;
      await logEvent("question.delete", "questions", row.id);
    },
    onSuccess: () => {
      toast.success("Questão excluída.");
      qc.invalidateQueries({ queryKey: ["questions"] });
      setDeleteTarget(null);
      setDeleteDeps(null);
      if (page > 0 && rows.length === 1) setPage((p) => p - 1);
    },
    onError: (e: Error) => toast.error(formatQuestionError(e.message)),
  });

  const deleteBlocked = deleteDeps ? hasDeleteDeps(deleteDeps) : false;

  const filterFields = useMemo(
    () => [
      { key: "course" as const, label: "Curso", options: courses },
      { key: "position" as const, label: "Cargo", options: positions },
      { key: "board" as const, label: "Banca", options: boards },
      { key: "exam" as const, label: "Concurso", options: exams },
      { key: "subject" as const, label: "Disciplina", options: subjects },
      { key: "topic" as const, label: "Assunto", options: topics },
    ],
    [courses, positions, boards, exams, subjects, topics],
  );

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setDialogOpen(true);
  }

  function openEdit(row: QuestionRow) {
    setEditing(row);
    setForm(rowToForm(row));
    setDialogOpen(true);
  }

  async function openDeleteDialog(row: QuestionRow) {
    setDeleteDeps(await fetchQuestionDeps(row.id));
    setDeleteTarget(row);
  }

  function updateAlternative(index: number, text: string) {
    setForm((prev) => ({
      ...prev,
      alternatives: prev.alternatives.map((a, i) => (i === index ? { ...a, text } : a)),
    }));
  }

  function addAlternative() {
    setForm((prev) => {
      const nextLetter = String.fromCharCode(65 + prev.alternatives.length);
      return { ...prev, alternatives: [...prev.alternatives, { letter: nextLetter, text: "" }] };
    });
  }

  function removeAlternative(index: number) {
    setForm((prev) => {
      if (prev.alternatives.length <= 2) return prev;
      return { ...prev, alternatives: prev.alternatives.filter((_, i) => i !== index) };
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Questões</h1>
          <p className="text-sm text-muted-foreground">
            CRUD completo de questões. Importação em lote continua disponível em Importação.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Nova questão
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-4">
        <TaxonomySearch value={search} onChange={setSearch} placeholder="Buscar enunciado..." />
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          {filterFields.map((f) => (
            <div key={f.key}>
              <Label>{f.label}</Label>
              <Select value={filters[f.key]} onValueChange={(v) => updateFilter(f.key, v)}>
                <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todos</SelectItem>
                  {f.options.map((o: { id: string; name: string }) => (
                    <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          <div>
            <Label>Ano</Label>
            <Input type="number" value={filters.year} onChange={(e) => updateFilter("year", e.target.value)} placeholder="Ex.: 2024" />
          </div>
          <div>
            <Label>Dificuldade</Label>
            <Select value={filters.difficulty} onValueChange={(v) => updateFilter("difficulty", v)}>
              <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todas</SelectItem>
                {DIFFICULTY_OPTIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enunciado</TableHead>
              <TableHead>Disciplina</TableHead>
              <TableHead>Assunto</TableHead>
              <TableHead>Banca</TableHead>
              <TableHead className="w-20">Ano</TableHead>
              <TableHead className="w-24">Dificuldade</TableHead>
              <TableHead className="w-28">Criado em</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={8} className="py-8 text-center text-muted-foreground">Carregando...</TableCell></TableRow>
            ) : isError ? (
              <TableRow><TableCell colSpan={8} className="py-8 text-center text-destructive">{formatQuestionError((error as Error).message)}</TableCell></TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                  {hasActiveFilters(filters, debouncedSearch) ? "Nenhuma questão encontrada." : "Nenhuma questão cadastrada."}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="max-w-md truncate font-medium">{row.statement}</TableCell>
                  <TableCell className="text-sm">{row.subjects?.name ?? "—"}</TableCell>
                  <TableCell className="text-sm">{row.topics?.name ?? "—"}</TableCell>
                  <TableCell className="text-sm">{row.boards?.name ?? "—"}</TableCell>
                  <TableCell>{row.year ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.difficulty ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(row.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" aria-label="Editar questão" onClick={() => openEdit(row)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" aria-label="Excluir questão" onClick={() => openDeleteDialog(row)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TaxonomyPagination page={page} total={total} onPageChange={setPage} />

      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditing(null); setForm(emptyForm()); } }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar questão" : "Nova questão"}</DialogTitle>
            <DialogDescription>Preencha enunciado, alternativas, gabarito e metadados.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
            <div>
              <Label htmlFor="q-statement">Enunciado *</Label>
              <Textarea id="q-statement" value={form.statement} onChange={(e) => setForm((p) => ({ ...p, statement: e.target.value }))} rows={4} required />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Alternativas *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addAlternative}>Adicionar</Button>
              </div>
              {form.alternatives.map((alt, index) => (
                <div key={`${alt.letter}-${index}`} className="flex gap-2">
                  <Input className="w-14" value={alt.letter} readOnly />
                  <Input value={alt.text} onChange={(e) => updateAlternative(index, e.target.value)} placeholder={`Alternativa ${alt.letter}`} />
                  <Button type="button" variant="ghost" size="icon" disabled={form.alternatives.length <= 2} onClick={() => removeAlternative(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label htmlFor="q-answer">Gabarito *</Label>
                <Input id="q-answer" value={form.correctAnswer} onChange={(e) => setForm((p) => ({ ...p, correctAnswer: e.target.value.toUpperCase() }))} maxLength={1} required />
              </div>
              <div>
                <Label htmlFor="q-year">Ano</Label>
                <Input id="q-year" type="number" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} min={1900} max={2100} />
              </div>
              <div>
                <Label>Dificuldade</Label>
                <Select value={form.difficulty || "__none__"} onValueChange={(v) => setForm((p) => ({ ...p, difficulty: v === "__none__" ? "" : v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">—</SelectItem>
                    {DIFFICULTY_OPTIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Disciplina</Label>
                <Select value={form.subjectId || "__none__"} onValueChange={(v) => setForm((p) => ({ ...p, subjectId: v === "__none__" ? "" : v, topicId: "" }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">—</SelectItem>
                    {subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Assunto</Label>
                <Select value={form.topicId || "__none__"} onValueChange={(v) => setForm((p) => ({ ...p, topicId: v === "__none__" ? "" : v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">—</SelectItem>
                    {formTopics.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Banca</Label>
                <Select value={form.boardId || "__none__"} onValueChange={(v) => setForm((p) => ({ ...p, boardId: v === "__none__" ? "" : v, examId: "" }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">—</SelectItem>
                    {boards.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Concurso</Label>
                <Select value={form.examId || "__none__"} onValueChange={(v) => setForm((p) => ({ ...p, examId: v === "__none__" ? "" : v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">—</SelectItem>
                    {formExams.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label>Cargo</Label>
                <Select value={form.positionId || "__none__"} onValueChange={(v) => setForm((p) => ({ ...p, positionId: v === "__none__" ? "" : v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">—</SelectItem>
                    {formPositions.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="q-explanation">Explicação</Label>
              <Textarea id="q-explanation" value={form.explanation} onChange={(e) => setForm((p) => ({ ...p, explanation: e.target.value }))} rows={3} />
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="q-legal">Referência legal</Label>
                <Input id="q-legal" value={form.metadata.legal_reference} onChange={(e) => setForm((p) => ({ ...p, metadata: { ...p.metadata, legal_reference: e.target.value } }))} />
              </div>
              <div>
                <Label htmlFor="q-biblio">Bibliografia</Label>
                <Textarea id="q-biblio" value={form.metadata.bibliography} onChange={(e) => setForm((p) => ({ ...p, metadata: { ...p.metadata, bibliography: e.target.value } }))} rows={2} />
              </div>
              <div>
                <Label htmlFor="q-image">URL da imagem</Label>
                <Input id="q-image" type="url" value={form.metadata.image_url} onChange={(e) => setForm((p) => ({ ...p, metadata: { ...p.metadata, image_url: e.target.value } }))} placeholder="https://..." />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={save.isPending}>{save.isPending ? "Salvando..." : "Salvar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteDeps(null); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteBlocked ? "Exclusão bloqueada" : "Excluir questão?"}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                {deleteBlocked ? (
                  <>
                    <p>Esta questão possui vínculos com dados de alunos e não pode ser excluída.</p>
                    <ul className="list-disc pl-5">
                      {deleteDeps?.filter((d) => d.count > 0).map((d) => <li key={d.label}>{d.count} {d.label}.</li>)}
                    </ul>
                  </>
                ) : (
                  <p>A questão será removida permanentemente. Esta ação não pode ser desfeita.</p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {deleteBlocked ? (
              <AlertDialogCancel>Entendi</AlertDialogCancel>
            ) : (
              <>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={remove.isPending} onClick={(e) => { e.preventDefault(); if (deleteTarget) remove.mutate(deleteTarget); }}>
                  {remove.isPending ? "Excluindo..." : "Excluir"}
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
