import type { Repository } from "../domain/ports/repository.js";
import type { Locality, LocalityFilters, LocalityInput } from "../domain/types/cadastre.js";
import { BaseCrudService } from "./base-crud-service.js";
import { validateLocalityCreate } from "./validators/domain-inputs.js";
import { mergePatch } from "./validators/without-base.js";

export class LocalityService extends BaseCrudService<Locality, LocalityInput, LocalityFilters> {
  constructor(repo: Repository<Locality, LocalityInput, LocalityFilters>) {
    super(repo, "Localidad");
  }

  protected prepareCreate(input: LocalityInput): LocalityInput {
    return validateLocalityCreate(input);
  }

  protected preparePatch(
    patch: Partial<LocalityInput>,
    current: Locality,
  ): Partial<LocalityInput> {
    return validateLocalityCreate(mergePatch(current, patch));
  }
}
