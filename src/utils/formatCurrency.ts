export const formatCurrency = (
  item: string | number,
  currency?: boolean
): string => {
  return new Intl.NumberFormat("pt-BR", {
    ...(currency && {
      style: "currency",
    }),
    // style: "currency",
    currency: "BRL",
  }).format(Number(item));
};
