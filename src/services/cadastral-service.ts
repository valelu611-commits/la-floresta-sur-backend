import type { Repository } from "../domain/ports/repository.js";
import type {
  CadastralProperty,
  CadastralPropertyFilters,
  CadastralPropertyInput,
} from "../domain/types/cadastre.js";
import { BaseCrudService } from "./base-crud-service.js";
import { validateCadastralCreate } from "./validators/domain-inputs.js";
import { mergePatch } from "./validators/without-base.js";

export class CadastralService extends BaseCrudService<
  CadastralProperty,
  CadastralPropertyInput,
  CadastralPropertyFilters
> {
  constructor(
    repo: Repository<CadastralProperty, CadastralPropertyInput, CadastralPropertyFilters>,
  ) {
    super(repo, "Predio");
  }

  protected prepareCreate(input: CadastralPropertyInput): CadastralPropertyInput {
    return validateCadastralCreate(input);
  }

  protected preparePatch(
    patch: Partial<CadastralPropertyInput>,
    current: CadastralProperty,
  ): Partial<CadastralPropertyInput> {
    return validateCadastralCreate(mergePatch(current, patch));
  }
}
