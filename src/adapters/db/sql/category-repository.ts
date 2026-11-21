import type { Database } from "../../../domain/ports/database.js";
import type {
  Category,
  CategoryFilters,
  CategoryInput,
  CategoryResource,
} from "../../../domain/types/place.js";
import { SqlCrudRepository } from "../sql/sql-repository.js";
import type { Row, SqlFragment, TableSpec } from "../sql/table-spec.js";

const COLUMNS = [
  "id", "slug", "name", "resource", "color", "icon", "description", "sort_order",
  "created_at", "updated_at",
] as const;

export const categorySpec: TableSpec<Category, CategoryInput, CategoryFilters> = {
  table: "categories",
  columns: COLUMNS,
  searchColumns: ["name", "slug", "description"],
  orderBy: "sort_order ASC, name ASC",
  toEntity(row: Row): Category {
    return {
      id: String(row.id),
      slug: String(row.slug),
      name: String(row.name),
      resource: String(row.resource) as CategoryResource,
      color: String(row.color),
      icon: String(row.icon),
      description: String(row.description ?? ""),
      sortOrder: Number(row.sort_order ?? 0),
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    };
  },
  toRow(input: Partial<CategoryInput>): Row {
    const row: Row = {};
    if (input.slug !== undefined) row.slug = input.slug;
    if (input.name !== undefined) row.name = input.name;
    if (input.resource !== undefined) row.resource = input.resource;
    if (input.color !== undefined) row.color = input.color;
    if (input.icon !== undefined) row.icon = input.icon;
    if (input.description !== undefined) row.description = input.description;
    if (input.sortOrder !== undefined) row.sort_order = input.sortOrder;
    return row;
  },
  filterSql(filters: CategoryFilters): SqlFragment[] {
    return filters.resource ? [{ sql: "resource = ?", params: [filters.resource] }] : [];
  },
};

export class SqlCategoryRepository extends SqlCrudRepository<
  Category,
  CategoryInput,
  CategoryFilters
> {
  constructor(db: Database) {
    super(db, categorySpec);
  }
}
