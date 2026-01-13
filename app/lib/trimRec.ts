function trimRecord<T>(
  record?: Record<string, T[]>,
  limit = 3
): Record<string, T[]> | undefined {
  if (!record) return undefined;

  return Object.fromEntries(
    Object.entries(record).map(([k, v]) => [k, v.slice(0, limit)])
  );
}
