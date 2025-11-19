// lib/utils.js
export function formatDate(dateString) {
  // format date nicely
  // example: from this  2025-05-20 to this  20 Mei 2025
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
