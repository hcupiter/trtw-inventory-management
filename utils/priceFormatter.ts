export function priceFormatter(price?: number) {
  if (!price) return `Rp. -1`;
  return `Rp. ${price.toLocaleString("id-ID")}`;
}
