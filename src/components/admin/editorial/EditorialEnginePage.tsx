import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resolveEditorialScope } from "@/lib/editorial/scope";
import { EDITORIAL_SCOPE } from "@/lib/editorial/constants";
import { AcervoPageShell } from "@/components/admin/acervo/shared";
import { EditorialProvider } from "./shared";
import { ArchitecturesSection } from "./ArchitecturesSection";
import { DisciplinesSection } from "./DisciplinesSection";
import { TopicsSection } from "./TopicsSection";
import { KeywordsSection } from "./KeywordsSection";
import { RulesSection } from "./RulesSection";
import { EvidencesSection } from "./EvidencesSection";

export function EditorialEnginePage() {
  const [architectureId, setArchitectureId] = useState<string | null>(null);

  const scopeQuery = useQuery({
    queryKey: ["editorial", "scope"],
    queryFn: resolveEditorialScope,
  });

  if (scopeQuery.isLoading) {
    return (
      <AcervoPageShell>
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Carregando escopo editorial…
        </div>
      </AcervoPageShell>
    );
  }

  if (scopeQuery.isError || !scopeQuery.data) {
    return (
      <AcervoPageShell>
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Não foi possível resolver o escopo {EDITORIAL_SCOPE.courseName} /{" "}
            {EDITORIAL_SCOPE.positionName}. Verifique a taxonomia.
          </CardContent>
        </Card>
      </AcervoPageShell>
    );
  }

  return (
    <EditorialProvider
      value={{
        scope: scopeQuery.data,
        architectureId,
        setArchitectureId,
      }}
    >
      <AcervoPageShell>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <Link to="/admin/acervo">
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Voltar ao Acervo
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Editorial Engine</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                V2 Lite — {scopeQuery.data.courseName} / {scopeQuery.data.positionName}. Motor
                editorial para classificação futura sem IA.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/acervo/editorial/import">
              <Upload className="mr-1.5 h-4 w-4" />
              Importar Arquitetura
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Centro editorial</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="architectures">
              <TabsList className="mb-4 flex h-auto flex-wrap gap-1">
                <TabsTrigger value="architectures">Arquiteturas</TabsTrigger>
                <TabsTrigger value="disciplines">Disciplinas</TabsTrigger>
                <TabsTrigger value="topics">Assuntos</TabsTrigger>
                <TabsTrigger value="keywords">Palavras-chave</TabsTrigger>
                <TabsTrigger value="rules">Regras</TabsTrigger>
                <TabsTrigger value="evidence">Evidências</TabsTrigger>
              </TabsList>

              <TabsContent value="architectures">
                <ArchitecturesSection />
              </TabsContent>
              <TabsContent value="disciplines">
                <DisciplinesSection />
              </TabsContent>
              <TabsContent value="topics">
                <TopicsSection />
              </TabsContent>
              <TabsContent value="keywords">
                <KeywordsSection />
              </TabsContent>
              <TabsContent value="rules">
                <RulesSection />
              </TabsContent>
              <TabsContent value="evidence">
                <EvidencesSection />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </AcervoPageShell>
    </EditorialProvider>
  );
}
