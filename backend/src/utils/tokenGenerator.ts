export const formatTokenNumber = (prefix: string, sequence: number): string => {
  const padded = String(sequence).padStart(3, "0");
  return `${prefix}-${padded}`;
};
