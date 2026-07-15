import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BENEFITS = [
  "Acesso completo ao Acervo Enfermeiro",
  "Sem cobrança automática — você decide se renova",
  "Garantia de 7 dias, sem burocracia",
];

export function ActivatePlanCard() {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <GraduationCap className="h-5 w-5" aria-hidden="true" />
        </div>
        <CardTitle className="mt-3 text-lg">Falta um passo para você começar a estudar</CardTitle>
        <CardDescription>
          Sua conta já está pronta, mas seu acesso ao Acervo ainda não foi ativado. Ative o Plano
          Fundador para liberar suas questões.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-sm">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/app/subscription">
            Conhecer Plano Fundador
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
