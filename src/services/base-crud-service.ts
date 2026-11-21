import type { BaseEntity, BaseFilters } from "../domain/types/common.js";
import { NotFoundError } from "../domain/errors.js";
import type { Repository } from "../domain/ports/repository.js";
import type { ResourceService } from "../domain/ports/service.js";

/**
 * Implementacion plantilla del CRUD (Template Method).
 * Las subclases solo aportan validacion/normalizacion de entrada.
 */
export abstract class BaseCrudService<
  T extends BaseEntity,
  TInput,
  F extends BaseFilters = BaseFilters,
> implements ResourceService<T, TInput, F>
{
  protected constructor(
    protected readonly repo: Repository<T, TInput, F>,
    private readonly label: string,
  ) {}

  list(filters: F): Promise<{ items: T[]; total: number; limit: number; offset: number }> {
    return this.repo.list(filters);
  }

  async get(id: string): Promise<T> {
    const entity = await this.repo.findById(id);
    if (!entity) throw new NotFoundError(this.label, id);
    return entity;
  }

  async create(input: TInput): Promise<T> {
    return this.repo.create(this.prepareCreate(input));
  }

  async update(id: string, patch: Partial<TInput>): Promise<T> {
    const current = await this.get(id);
    const updated = await this.repo.update(id, this.preparePatch(patch, current));
    return updated ?? this.get(id);
  }

  async remove(id: string): Promise<void> {
    await this.get(id);
    await this.repo.remove(id);
  }

  protected abstract prepareCreate(input: TInput): TInput;
  protected abstract preparePatch(patch: Partial<TInput>, current: T): Partial<TInput>;
}
