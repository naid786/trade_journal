"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { StepBack, Play, StepForward, GripVertical, X } from "lucide-react";
import DateRangeSelector from "./ui/date-range-selector";
import { IChartApi, ISeriesApi } from "lightweight-charts";
import { Timeframe } from "./timeframe_selector";


interface ChartData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

const ReplayButton = ({ startDate, endDate, onReplay, onClick, timeframe }: { startDate: string | null, endDate: string | null, onReplay: (start: Date | null) => void, onClick: () => void, timeframe: Timeframe }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [start, setStart] = useState(startDate || '');

    // Call onReplay when replay starts
    const handleReplay = () => {
        setIsOpen(false);
        if (onReplay) {
            onReplay(start ? new Date(start) : null);
        }
    };
    return (
        <>
            <Modal
                title={"Select Symbol"}
                description="Choose a symbol for your chart."
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <div className="flex flex-col gap-4">
                    <div>
                        {/* <label htmlFor="start-date" className="block mb-1">Start Date</label> */}
                        {<span className="block mb-1">Start Date</span>}
                        <input
                            id="start-date"
                            type="datetime-local"
                            value={start || ''}
                            max={endDate || ''}
                            min={startDate || ''}
                            onChange={e => setStart(e.target.value)}
                            className="border rounded px-2 py-1"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="default" onClick={() => {
                            // setIsOpen(false);
                            // setShowPlayWidget(true);
                            handleReplay();
                        }}>
                            Replay
                        </Button>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    </div>
                </div>
            </Modal>
            <Button variant="ghost" onClick={() => {setIsOpen(true); onClick();}}>
                <StepBack />
                <span className="font-semibold text-xl m-2">Replay</span>
            </Button>
        </>
    );
}

export default ReplayButton;