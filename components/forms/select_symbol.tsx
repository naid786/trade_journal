import React, { useEffect, useState } from "react";
import { fetchBinanceSymbols } from "@/data/data";

interface SelectSymbolProps {
  value?: {
    symbol: string;
    decimal: number;
  };
  onChange: ({symbol, decimal}: {
    symbol: string;
    decimal: number;
  }) => void;
}

const SelectSymbol: React.FC<SelectSymbolProps> = ({ value, onChange }) => {
  const [symbols, setSymbols] = useState<{ symbol: string; decimal: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadSymbols() {
      try {
        const all = await fetchBinanceSymbols();
        setSymbols(all.map((s: any) => ({ symbol: s.symbol, decimal: s.baseAssetPrecision })));
        
      } catch (e) {
        setSymbols([]);
      } finally {
        setLoading(false);
      }
    }
    loadSymbols();
  }, []);

  const filtered = symbols.filter(s => s.symbol.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <input
        id="symbol-search"
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border rounded px-2 py-1 w-full mb-2"
        placeholder="Type to search..."
        disabled={loading}
      />
      <div className="border rounded max-h-64 overflow-y-auto bg-white">
        {loading ? (
          <div className="p-2 text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-2 text-gray-500">No symbols found</div>
        ) : (
          filtered.map(s => (
            <div
              key={s.symbol}
              className={`p-2 cursor-pointer hover:bg-blue-100 ${value?.symbol === s.symbol ? "bg-blue-200" : ""}`}
              onClick={() => onChange({symbol: s.symbol, decimal: s.decimal})}
            >
              {s.symbol}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SelectSymbol;