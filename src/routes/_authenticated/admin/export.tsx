import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/export")({
  component: ExportPage,
});

const tables = ["courses", "positions", "boards", "exams", "subjects", "topics", "questions", "packages", "package_versions"];

function toCsv(rows: any[]): string {
  if (rows.length === 0) return "";
  const keys = Object.keys(rows[0]);
  const escape = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [keys.join(","), ...rows.map((r) => keys.map((k) => escape(r[k])).join(","))].join("\n");
}

function download(name: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

function ExportPage() {
  const [table, setTable] = useState("courses");
  const [format, setFormat] = useState("csv");
  const [busy, setBusy] = useState(false);

  async function handleExport() {
    setBusy(true);
    const { data, error } = await supabase.from(table as any).select("*");
    setBusy(false);
    if (error) return toast.error(error.message);
    const rows = data ?? [];
    if (format === "json") download(`${table}.json`, JSON.stringify(rows, null, 2), "application/json");
    else if (format === "csv") download(`${table}.csv`, toCsv(rows), "text/csv");
    else download(`${table}.xls`, toCsv(rows), "application/vnd.ms-excel");
    toast.success(`Exportadas ${rows.length} linhas`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Exportação</h1>
        <p className="text-sm text-muted-foreground">Exporte dados em CSV, Excel ou JSON.</p>
      </div>
      <div className="rounded-xl border bg-card p-6 space-y-4 max-w-lg">
        <div>
          <Label>Tabela</Label>
          <Select value={table} onValueChange={setTable}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {tables.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Formato</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleExport} disabled={busy} aria-busy={busy}>
          <Download className="h-4 w-4 mr-2" />
          {busy ? "Exportando..." : "Exportar"}
        </Button>
      </div>
    </div>
  );
}
