import { ContextEntry } from "@/app/types/chat";

function applyContextUpdate<T>(
  existing: ContextEntry<T>[] = [],
  incoming: ContextEntry<T>
): ContextEntry<T>[] {
  const match = existing.find((e) => e.value === incoming.value);

  if (!match) {
    return [...existing, incoming];
  }

  return existing.map((e) =>
    e.value === incoming.value
      ? {
          ...e,
          confidence: Math.min(1, e.confidence + 0.1),
          updatedAt: Date.now(),
        }
      : e
  );
}
