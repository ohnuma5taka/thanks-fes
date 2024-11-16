const bool = (trueRate?: number) => Math.random() < (trueRate || 0.5);
const int = (max: number, min?: number) =>
  Math.floor(Math.random() * (max + 1 - (min || 0))) + (min || 0);
const float = (max: number, min?: number) =>
  +(Math.random() * (max - (min || 0)) + (min || 0)).toFixed(3);
const choice = <T>(items: T[]): T => items[int(items.length - 1)];
const sample = <T>(items: T[], count?: number): T[] => {
  for (let i = 0; i < items.length; i++) {
    const k = int(items.length - 1);
    if (k !== i) [items[k], items[i]] = [items[i], items[k]];
  }
  return items.slice(0, count || items.length);
};
const separateCounts = (total: number, slot: number) => {
  const randoms = [...Array(slot)].map((_) => float(1));
  const scale = total / randoms.reduce((ret, x) => ret + x, 0);
  const counts = randoms.map((x) => Math.floor(x * scale));
  const diff = total - counts.reduce((ret, x) => ret + x, 0);
  [...Array(diff)].forEach(
    (_, i) => (counts[Math.max(0, counts.length - i - 1)] += 1)
  );
  return counts;
};

export const randomUtil = {
  bool,
  int,
  float,
  choice,
  sample,
  separateCounts,
};
