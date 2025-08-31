export interface ChartParams {
    id: string;
    name: string;
    symbol: string;
    range: {
        start: string;
        end: string;
    };
    timeframes: string[];
}