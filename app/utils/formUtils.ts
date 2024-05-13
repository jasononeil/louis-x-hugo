export function getStringFromFormData(
  body: FormData,
  field: string
): string | undefined {
  const value = body.get(field);
  if (typeof value === "string") {
    return value;
  }
  // If the value was `null` or a `File` don't return anything
}

export function getIntFromFormData(
  body: FormData,
  field: string,
  fallbackValue: number
) {
  const string = getStringFromFormData(body, field);
  if (!string) {
    return fallbackValue;
  }
  return parseInt(string, 10) || fallbackValue;
}
