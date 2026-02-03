export const slugify = (id: string, name: string) =>
  [
    id
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 4)
      .toUpperCase(),
    name
      .normalize("NFD")
      .replace(/[^\x00-\x7F]/g, "")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .slice(0, 59)
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase(),
  ].join("-");
