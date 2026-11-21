import type { Repository } from "../domain/ports/repository.js";
import type {
  SecurityIncident,
  SecurityIncidentFilters,
  SecurityIncidentInput,
} from "../domain/types/safety.js";
import { BaseCrudService } from "./base-crud-service.js";
import { validateIncidentCreate } from "./validators/domain-inputs.js";
import { mergePatch } from "./validators/without-base.js";

export class SecurityService extends BaseCrudService<
  SecurityIncident,
  SecurityIncidentInput,
  SecurityIncidentFilters
> {
  constructor(repo: Repository<SecurityIncident, SecurityIncidentInput, SecurityIncidentFilters>) {
    super(repo, "Hecho de seguridad");
  }

  protected prepareCreate(input: SecurityIncidentInput): SecurityIncidentInput {
    return validateIncidentCreate(input);
  }

  protected preparePatch(
    patch: Partial<SecurityIncidentInput>,
    current: SecurityIncident,
  ): Partial<SecurityIncidentInput> {
    return validateIncidentCreate(mergePatch(current, patch));
  }
}
