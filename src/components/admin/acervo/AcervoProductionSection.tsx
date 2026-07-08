import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAcervoFilesFn } from "@/lib/acervo/acervo.functions";

const PRODUCTION_ACTIONS = [
  { id: "register", label: "Registrar Arquivos" },
  { id: "extract", label: "Extrair Texto" },
  { id: "generate", label: "Gerar Questões" },
  { id: "review", label: "Revisar" },
  { id: "import", label: "Importar" },
  { id: "publish", label: "Publicar" },
] as const;

type AcervoProductionSectionProps = {
  examId: string;
  onRegistered: () => void;
};

type FileField = "prova" | "gabarito" | "edital";

async function fileToPayload(file: File) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return { name: file.name, data: btoa(binary) };
}

export function AcervoProductionSection({
  examId,
  onRegistered,
}: AcervoProductionSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [files, setFiles] = useState<Partial<Record<FileField, File>>>({});

  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!files.prova) {
        throw new Error("Selecione o PDF da prova.");
      }
      return registerAcervoFilesFn({
        data: {
          examId,
          prova: await fileToPayload(files.prova),
          gabarito: files.gabarito ? await fileToPayload(files.gabarito) : undefined,
          edital: files.edital ? await fileToPayload(files.edital) : undefined,
        },
      });
    },
    onSuccess: () => {
      toast.success("Arquivos registrados com sucesso.");
      setDialogOpen(false);
      setFiles({});
      onRegistered();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Falha ao registrar arquivos.");
    },
  });

  function handleFileChange(field: FileField, fileList: FileList | null) {
    const file = fileList?.[0];
    setFiles((prev) => {
      const next = { ...prev };
      if (file) next[field] = file;
      else delete next[field];
      return next;
    });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Produção</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Registre os PDFs da prova para enviar diretamente ao Supabase Storage (bucket{" "}
            <span className="font-mono text-xs">acervo</span>).
          </p>
          <div className="flex flex-wrap gap-2">
            {PRODUCTION_ACTIONS.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                disabled={action.id !== "register"}
                onClick={() => {
                  if (action.id === "register") setDialogOpen(true);
                }}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setFiles({});
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Arquivos</DialogTitle>
            <DialogDescription>
              Selecione os PDFs. Ao confirmar, os arquivos são enviados para{" "}
              <span className="font-mono text-xs">acervo/{examId}/</span> e o catálogo é
              atualizado.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="acervo-prova">Prova (PDF) *</Label>
              <Input
                id="acervo-prova"
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) => handleFileChange("prova", event.target.files)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="acervo-gabarito">Gabarito (PDF)</Label>
              <Input
                id="acervo-gabarito"
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) => handleFileChange("gabarito", event.target.files)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="acervo-edital">Edital (PDF)</Label>
              <Input
                id="acervo-edital"
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) => handleFileChange("edital", event.target.files)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={registerMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => registerMutation.mutate()}
              disabled={!files.prova || registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Registrando…
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
