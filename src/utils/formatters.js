import { format } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Format a number as Indonesian Rupiah currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a date as a readable string
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), "dd MMMM yyyy", { locale: id });
  } catch (e) {
    return dateString;
  }
};

export const formatPrice = (price) => {
  return `Rp ${Number(price || 0).toLocaleString("id-ID")}`;
};
