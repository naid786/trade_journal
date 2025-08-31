import { ChartData } from "@/components/chart";

export interface markers {
    time: string;
    position: string;
    color: string;
    shape: string;
    text?: string;
}

export const getSwing = (data: ChartData[], lag: number = 2) => {
    const markers: markers[] = [];
    // Logic to determine swing points and create markers
    for (let i = lag; i < data.length - lag; i++) {
        const isSwingHigh = data[i].close > Math.max(...data.slice(i - lag, i).map(d => d.close)) &&
            data[i].close > Math.max(...data.slice(i + 1, i + lag + 1).map(d => d.close));
        const isSwingLow = data[i].close < Math.min(...data.slice(i - lag, i).map(d => d.close)) &&
            data[i].close < Math.min(...data.slice(i + 1, i + lag + 1).map(d => d.close));
        if (isSwingHigh) {
            markers.push({
                time: data[i].time,
                position: "aboveBar",
                color: "green",
                shape: "circle",
                text: "Swing High"
            });
        } else if (isSwingLow) {
            markers.push({
                time: data[i].time,
                position: "belowBar",
                color: "red",
                shape: "circle",
                text: "Swing Low"
            });
        }
    }
    return markers;
}

