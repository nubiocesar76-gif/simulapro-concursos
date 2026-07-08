import type { AcervoStats, CatalogExam, CatalogExamStatus } from "./types";
import { computeAcervoStats, parseCatalogCsv } from "./catalog-csv";

/**
 * Origem: docs/catalog/enfermagem.csv — apenas para importação inicial.
 */
import catalogCsv from "../../../docs/catalog/enfermagem.csv?raw";

export interface CatalogRepository {
  list(): Promise<CatalogExam[]>;
  getBySlug(slug: string): Promise<CatalogExam | null>;
  stats(exams?: CatalogExam[]): Promise<AcervoStats>;
}

export class CsvCatalogRepository implements CatalogRepository {
  private cachedExams: CatalogExam[] | null = null;

  private loadExams(): CatalogExam[] {
    if (this.cachedExams) return this.cachedExams;
    this.cachedExams = parseCatalogCsv(catalogCsv);
    return this.cachedExams;
  }

  async list(): Promise<CatalogExam[]> {
    return this.loadExams();
  }

  async getBySlug(slug: string): Promise<CatalogExam | null> {
    return this.loadExams().find((exam) => exam.id === slug) ?? null;
  }

  async stats(exams?: CatalogExam[]): Promise<AcervoStats> {
    return computeAcervoStats(exams ?? this.loadExams());
  }
}

/** Somente importação CSV — não usar em runtime do Acervo. */
export const csvCatalogRepository = new CsvCatalogRepository();
