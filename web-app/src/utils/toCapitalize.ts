export const toCapitalize = (string: string) =>
  string[0] ? string[0].toUpperCase() + string.toLowerCase().substring(1) : "";
