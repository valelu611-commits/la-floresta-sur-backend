import type { BaseEntity, BaseFilters, Page } from "../../src/domain/types/common.js";
import type { Repository } from "../../src/domain/ports/repository.js";

let counter = 0;

/** Repositorio en memoria: demuestra Liskov (mismo contrato, otra tecnologia). */
export class InMemoryRepository<
  T extends BaseEntity,
  TInput,
  F extends BaseFilters = BaseFilters,
> implements Repository<T, TInput, F>
{
  readonly items: T[] = [];

  async list(filters: F): Promise<Page<T>> {
    return {
      items: this.items.slice(filters.offset, filters.offset + filters.limit),
      total: this.items.length,
      limit: filters.limit,
      offset: filters.offset,
    };
  }

  async findById(id: string): Promise<T | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async create(input: TInput): Promise<T> {
    const now = new Date().toISOString();
    const entity = {
      ...(input as object),
      id: `mem-${++counter}`,
      createdAt: now,
      updatedAt: now,
    } as T;
    this.items.push(entity);
    return entity;
  }

  async update(id: string, patch: Partial<TInput>): Promise<T | null> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index < 0) return null;
    const current = this.items[index] as T;
    const next = { ...current, ...(patch as object), updatedAt: new Date().toISOString() } as T;
    this.items[index] = next;
    return next;
  }

  async remove(id: string): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index < 0) return false;
    this.items.splice(index, 1);
    return true;
  }
}
