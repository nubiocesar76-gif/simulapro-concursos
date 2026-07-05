import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generatePackageSlug } from "@/lib/packages";

export const TAXONOMY_PAGE_SIZE = 10;

export function formatTaxonomyError(message: string, entityLabel: string) {
  if (message.includes("row-level security")) {
    return "Sem permissão para esta operação. Verifique se seu usuário possui role admin.";
  }
  if (message.includes("duplicate key") || message.includes("unique")) {
    return `Já existe um ${entityLabel} com este nome.`;
  }
  return message;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function validateName(name: string, label = "Nome") {
  const trimmed = name.trim();
  if (!trimmed) throw new Error(`${label} é obrigatório.`);
  if (trimmed.length < 2) throw new Error(`${label} deve ter pelo menos 2 caracteres.`);
  if (trimmed.length > 200) throw new Error(`${label} deve ter no máximo 200 caracteres.`);
  return trimmed;
}

export function validateDescription(description: string) {
  const trimmed = description.trim();
  if (trimmed.length > 2000) throw new Error("Descrição deve ter no máximo 2000 caracteres.");
  return trimmed || null;
}

export function slugFromTaxonomyName(name: string, entityLabel: string) {
  const slug = generatePackageSlug(name);
  if (!slug) throw new Error(`Nome inválido para gerar identificador do ${entityLabel}.`);
  return slug;
}

export function useDebouncedSearch(delay = 300) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(0);
    }, delay);
    return () => clearTimeout(t);
  }, [search, delay]);

  return { search, setSearch, debouncedSearch, page, setPage };
}

export function getPageLabel(page: number, total: number, pageSize = TAXONOMY_PAGE_SIZE) {
  if (total === 0) return "Nenhum registro";
  const from = page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, total);
  return `${from}–${to} de ${total}`;
}

export function getTotalPages(total: number, pageSize = TAXONOMY_PAGE_SIZE) {
  return Math.max(1, Math.ceil(total / pageSize));
}

type TaxonomySearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function TaxonomySearch({ value, onChange, placeholder }: TaxonomySearchProps) {
  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="pl-9"
        placeholder={placeholder ?? "Buscar..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

type TaxonomyPaginationProps = {
  page: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function TaxonomyPagination({ page, total, onPageChange }: TaxonomyPaginationProps) {
  if (total <= 0) return null;

  const totalPages = getTotalPages(total);

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">{getPageLabel(page, total)}</p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          Página {page + 1} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export type DeleteDep = { label: string; count: number };

export function hasDeleteDeps(deps: DeleteDep[]) {
  return deps.some((d) => d.count > 0);
}
