import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, Sparkles, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 font-bold text-lg">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          SimulaPro
        </div>
        <div className="flex gap-2">
          <Button asChild variant="ghost">
            <Link to="/app">Área do Aluno</Link>
          </Button>
          <Button asChild>
            <Link to="/admin">Admin</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="py-20 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            <Sparkles className="h-3 w-3" /> Plataforma profissional de concursos
          </div>
          <h1 className="mx-auto max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
            Prepare-se para concursos com{" "}
            <span className="text-primary">estrutura profissional</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Questões organizadas por curso, cargo, banca, disciplina e assunto — dos últimos
            três anos de cada banca.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/app">Entrar como Aluno</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/admin">Painel Admin</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-6 pb-20 sm:grid-cols-3">
          {[
            {
              icon: Target,
              title: "Estudo direcionado",
              desc: "Escolha uma disciplina e resolva questões reais das principais bancas.",
            },
            {
              icon: TrendingUp,
              title: "Acompanhe evolução",
              desc: "Estatísticas detalhadas do seu desempenho por disciplina.",
            },
            {
              icon: Sparkles,
              title: "Curadoria contínua",
              desc: "Banco atualizado com as questões mais recentes dos concursos.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1 font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
