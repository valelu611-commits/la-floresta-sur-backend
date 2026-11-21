import {
  optionalText,
  requireBogotaCoords,
  requireOneOf,
  requireText,
} from "../../domain/validation.js";
import type { PlaceInput } from "../../domain/types/place.js";
import { PLACE_CATEGORIES } from "../../domain/types/index.js";

const MAX_DESCRIPTION = 2000;

export function validatePlaceCreate(input: PlaceInput): PlaceInput {
  return {
    categorySlug: requireOneOf(input.categorySlug, "categorySlug", PLACE_CATEGORIES),
    name: requireText(input.name, "name", 2, 160),
    address: requireText(input.address, "address", 3, 240),
    ...requireBogotaCoords(input.lat, input.lon),
    description: optionalText(input.description, "description", MAX_DESCRIPTION),
    phone: optionalText(input.phone, "phone", 60),
    website: optionalText(input.website, "website", 240),
    hours: optionalText(input.hours, "hours", 120),
    metadata: typeof input.metadata === "object" && input.metadata ? input.metadata : {},
    source: optionalText(input.source, "source", 240) || "Registro ciudadano",
    verified: Boolean(input.verified),
  };
}

export function validatePlacePatch(patch: Partial<PlaceInput>): Partial<PlaceInput> {
  const next: Partial<PlaceInput> = {};
  if (patch.categorySlug !== undefined) {
    next.categorySlug = requireOneOf(patch.categorySlug, "categorySlug", PLACE_CATEGORIES);
  }
  if (patch.name !== undefined) next.name = requireText(patch.name, "name", 2, 160);
  if (patch.address !== undefined) next.address = requireText(patch.address, "address", 3, 240);
  if (patch.lat !== undefined || patch.lon !== undefined) {
    if (patch.lat === undefined || patch.lon === undefined) {
      throw new Error("lat y lon deben enviarse juntos");
    }
    Object.assign(next, requireBogotaCoords(patch.lat, patch.lon));
  }
  if (patch.description !== undefined) {
    next.description = optionalText(patch.description, "description", MAX_DESCRIPTION);
  }
  if (patch.phone !== undefined) next.phone = optionalText(patch.phone, "phone", 60);
  if (patch.website !== undefined) next.website = optionalText(patch.website, "website", 240);
  if (patch.hours !== undefined) next.hours = optionalText(patch.hours, "hours", 120);
  if (patch.metadata !== undefined) next.metadata = patch.metadata;
  if (patch.source !== undefined) next.source = optionalText(patch.source, "source", 240);
  if (patch.verified !== undefined) next.verified = Boolean(patch.verified);
  return next;
}
