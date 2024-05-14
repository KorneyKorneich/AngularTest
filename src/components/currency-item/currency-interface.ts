export interface CurrencyInterface {
    quotes: Record<string, string>,
    source: string,
    success: boolean,
    timestamp: number,
}
