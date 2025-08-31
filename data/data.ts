// import fs from 'fs';
// import { parse } from 'csv-parse/sync';

// export function readCsvFile(filePath: string): any[] {
//     const fileContent = fs.readFileSync(filePath, 'utf-8');
//     const records = parse(fileContent, {
//         columns: true,
//         skip_empty_lines: true
//     });
//     return records;
// }

export async function fetchBinanceOHLC(
	symbol: string,
	interval: string,
	startTime: number, // timestamp in ms
	endTime: number // timestamp in ms
) {
	const maxLimit = 1000;
	let allData: any[] = [];
	let fetchStart = startTime;
	while (fetchStart < endTime) {
		const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${fetchStart}&endTime=${endTime}&limit=${maxLimit}`;
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch data: ${response.statusText}`);
		}
		const data = await response.json();
		if (data.length === 0) break;
		allData = allData.concat(data);
		// Move to next batch
		fetchStart = data[data.length - 1][6] + 1; // closeTime + 1ms
		if (data.length < maxLimit) break;
	}
	return allData.map((d: any) => ({
		time: d[0],
		open: parseFloat(d[1]),
		high: parseFloat(d[2]),
		low: parseFloat(d[3]),
		close: parseFloat(d[4]),
		volume: parseFloat(d[5]),
		closeTime: d[6]
	}));
}

export async function fetchBinanceSymbols() {
	const url = 'https://api.binance.com/api/v3/exchangeInfo';
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch symbol info: ${response.statusText}`);
	}
	const data = await response.json();
	return data.symbols;
}

