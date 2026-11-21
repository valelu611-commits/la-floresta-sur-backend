import type { Repository } from "../domain/ports/repository.js";
import type {
  RoadSegment,
  RoadSegmentFilters,
  RoadSegmentInput,
} from "../domain/types/safety.js";
import { BaseCrudService } from "./base-crud-service.js";
import { validateRoadCreate } from "./validators/domain-inputs.js";
import { mergePatch } from "./validators/without-base.js";

export class RoadService extends BaseCrudService<
  RoadSegment,
  RoadSegmentInput,
  RoadSegmentFilters
> {
  constructor(repo: Repository<RoadSegment, RoadSegmentInput, RoadSegmentFilters>) {
    super(repo, "Segmento vial");
  }

  protected prepareCreate(input: RoadSegmentInput): RoadSegmentInput {
    return validateRoadCreate(input);
  }

  protected preparePatch(
    patch: Partial<RoadSegmentInput>,
    current: RoadSegment,
  ): Partial<RoadSegmentInput> {
    return validateRoadCreate(mergePatch(current, patch));
  }
}
