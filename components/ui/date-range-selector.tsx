import { ArrowRight } from "lucide-react";
import React from "react";

interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  onChange: (range: { startDate: string; endDate: string }) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ startDate, endDate, onChange }) => {
  return (
    <div className="flex gap-4 items-center">
      <div>
        {/* <label htmlFor="start-date" className="block mb-1">Start Date</label> */}
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={e => onChange({ startDate: e.target.value, endDate })}
          className="border rounded px-2 py-1"
        />
      </div>
      <ArrowRight/>
      <div>
        {/* <label htmlFor="end-date" className="block mb-1">End Date</label> */}
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={e => onChange({ startDate, endDate: e.target.value })}
          className="border rounded px-2 py-1"
        />
      </div>
    </div>
  );
};

export default DateRangeSelector;