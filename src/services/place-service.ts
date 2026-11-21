import type { Repository } from "../domain/ports/repository.js";
import type { Place, PlaceFilters, PlaceInput } from "../domain/types/place.js";
import { BaseCrudService } from "./base-crud-service.js";
import { validatePlaceCreate } from "./validators/place.js";
import { mergePatch } from "./validators/without-base.js";

export class PlaceService extends BaseCrudService<Place, PlaceInput, PlaceFilters> {
  constructor(repo: Repository<Place, PlaceInput, PlaceFilters>) {
    super(repo, "Lugar");
  }

  protected prepareCreate(input: PlaceInput): PlaceInput {
    return validatePlaceCreate(input);
  }

  protected preparePatch(patch: Partial<PlaceInput>, current: Place): Partial<PlaceInput> {
    return validatePlaceCreate(mergePatch(current, patch));
  }
}
