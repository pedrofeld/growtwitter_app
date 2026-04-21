export const DEFAULT_AVATAR = "https://img.icons8.com/?size=100&id=14736&format=png&color=000000";

export function resolveAvatarUrl(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    if (typeof value === "string") {
      const trimmedValue = value.trim();

      if (trimmedValue) {
        return trimmedValue;
      }
    }
  }

  return DEFAULT_AVATAR;
}