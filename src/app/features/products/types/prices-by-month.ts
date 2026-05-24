export type PricesByMonth = {
  monthLabel: string;
  monthStartTimestamp: number;
  prices: number[];
  averagePrice: number | null;
};
