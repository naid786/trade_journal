import React from "react";
import { Button } from "./ui/button";

export enum Timeframe {
  "1m" = "1m",
  "5m" = "5m",
  "15m" = "15m",
  "30m" = "30m",
  "1h" = "1h",
  "4h" = "4h",
  "1d" = "1d",
  "1w" = "1w",
}

export const DEFAULT_TIMEFRAME = Timeframe["1h"];

interface TimeframeSelectorProps {
  value: Timeframe;
  onChange: (tf: Timeframe) => void;
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex gap-2 items-center">
      {Object.values(Timeframe).map(tf => (
        <Button
            
          key={tf}
          className={`px-3 py-1 rounded hover:bg-background  ${value === tf ? "bg-background text-accent-foreground" : "bg-transparent text-accent-foreground "}`}
          onClick={() => onChange(tf as Timeframe)}
        >
          {tf}
          </Button>
      ))}
    </div>
  );
};

export default TimeframeSelector;
