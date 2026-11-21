import type { BaseEntity } from "../../domain/types/common.js";

/** Quita los campos tecnicos para reutilizar la entidad como entrada validable. */
export function withoutBase<T extends BaseEntity>(entity: T): Omit<T, keyof BaseEntity> {
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = entity;
  return rest;
}

/** Combina la entidad actual con un parche parcial conservando el tipo de entrada. */
export function mergePatch<T extends BaseEntity>(
  current: T,
  patch: Partial<Omit<T, keyof BaseEntity>>,
): Omit<T, keyof BaseEntity> {
  return { ...withoutBase(current), ...patch } as Omit<T, keyof BaseEntity>;
}
