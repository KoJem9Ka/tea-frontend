import { z } from 'zod/v4';


export enum WeightUnitEnum {
  G = 'G',
  KG = 'KG',
}

export type WeightUnit = z.infer<typeof WeightUnit>;
export const WeightUnit = z.enum(WeightUnitEnum);

export const weightUnitPrettyPrintMap = {
  [WeightUnitEnum.G]: 'г.',
  [WeightUnitEnum.KG]: 'кг.',
} as const;

const weightUnitOrderMap = {
  [WeightUnitEnum.G]: 0,
  [WeightUnitEnum.KG]: 1,
} as const;


export type Unit = z.infer<typeof Unit>;
export const Unit = z.object({
  id: z.uuid(),
  isApiece: z.boolean(),
  weightUnit: WeightUnit,
  value: z.number({ error: 'Некорректное значение' }).positive({ error: 'Только положительные числа' }),
});


export type UnitUpsert = z.infer<typeof UnitUpsert>;
export const UnitUpsert = Unit.omit({ id: true }).extend({
  id: z.uuid().optional(),
});


export function unitSortFn(a: Unit, b: Unit) {
  if (a.weightUnit !== b.weightUnit) return weightUnitOrderMap[b.weightUnit] - weightUnitOrderMap[a.weightUnit];
  return b.value - a.value;
}

export function unitPrettyPrint(unit: Pick<Unit, 'isApiece' | 'weightUnit' | 'value'>) {
  const { data: unitSafe, error } = UnitUpsert.safeParse(unit);
  if (error) return '???';
  const weight = `${unitSafe.value} ${weightUnitPrettyPrintMap[unitSafe.weightUnit]}`;
  return unitSafe.isApiece ? `1 шт. (${weight})` : weight;
}
