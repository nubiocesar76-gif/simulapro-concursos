import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatAdminError } from "@/lib/admin-ui";

type AdminTableBodyProps = {
  colSpan: number;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  isEmpty: boolean;
  emptyMessage: string;
  filteredEmptyMessage?: string;
  hasActiveFilters?: boolean;
  formatError?: (message: string) => string;
  skeletonRows?: number;
  children: React.ReactNode;
};

function TableSkeletonRows({ colSpan, rows }: { colSpan: number; rows: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index}>
          <TableCell colSpan={colSpan} className="py-3">
            <Skeleton className="h-5 w-full" aria-hidden="true" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export function AdminTableBody({
  colSpan,
  isLoading,
  isError,
  error,
  isEmpty,
  emptyMessage,
  filteredEmptyMessage,
  hasActiveFilters = false,
  formatError = formatAdminError,
  skeletonRows = 5,
  children,
}: AdminTableBodyProps) {
  if (isLoading) {
    return <TableSkeletonRows colSpan={colSpan} rows={skeletonRows} />;
  }

  if (isError) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="py-8 text-center text-destructive" role="alert">
          {formatError((error as Error)?.message ?? "Erro ao carregar dados.")}
        </TableCell>
      </TableRow>
    );
  }

  if (isEmpty) {
    const message =
      hasActiveFilters && filteredEmptyMessage ? filteredEmptyMessage : emptyMessage;
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="py-8 text-center text-muted-foreground" role="status">
          {message}
        </TableCell>
      </TableRow>
    );
  }

  return <>{children}</>;
}
