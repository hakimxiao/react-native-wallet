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

export const formatRupiah = (value) => {
  if (!value) return "0";

  const num = parseInt(value, 10);
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
