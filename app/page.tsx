"use client";

import { ChartComponent } from "@/components/chart";
import SelectSymbol from "@/components/forms/select_symbol";
import TimeframeSelector, { DEFAULT_TIMEFRAME, Timeframe } from "@/components/timeframe_selector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DateRangeSelector from "@/components/ui/date-range-selector";
import { Modal } from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import { fetchBinanceOHLC} from "@/data/data";
import { AlarmClockPlus, ChartBarIncreasingIcon, Layers2, Search, StepBack, RectangleHorizontal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { parseISO } from "date-fns";
import ReplayButton from "@/components/replay_button";
import {  ChartComponentHandle } from "@/components/chart";
import DraggablePlayWidget from "@/components/chart/replay_widget";
import { RectangleDrawingTool } from "@/components/chart/rectangle-drawing-tool";
import { createSeriesMarkers, MouseEventParams, Time } from "lightweight-charts";
import { getSwing, markers } from "@/lib/indicator";


export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef<ChartComponentHandle>(null);
  const rectangleToolRef = useRef<RectangleDrawingTool | null>(null);
  const [showPlayWidget, setShowPlayWidget] = useState(false);

  const [swings, setSwings] = useState<markers[]>([]);

  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [symbol, setSymbol] = useState<{ symbol: string; decimal: number } | null>(null);
  const [selectedTf, setSelectedTf] = useState<Timeframe>(DEFAULT_TIMEFRAME);

  const [ohlcData, setOhlcData] = useState<any[]>([]);
  
  useEffect(() => {
    async function fetchData() {
      if (!symbol || !startDate || !endDate || !selectedTf) return;
      setLoading(true);
      try {
        const startTs = parseISO(startDate).getTime();
        const endTs = parseISO(endDate).getTime();
        if (isNaN(startTs) || isNaN(endTs) || startTs >= endTs) return;
        const data = await fetchBinanceOHLC(symbol.symbol, selectedTf, startTs, endTs);
        setOhlcData(data);
        const swingPoints = getSwing(data,12);
        setSwings(swingPoints);
      } catch (e) {
        setOhlcData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [symbol, startDate, endDate, selectedTf]);


  const selectSymbol = (symbol: { symbol: string; decimal: number }) => {
    setSymbol(symbol);
    setIsOpen(false);
  };

  const Reply = (start: Date | null) => {
    if (!start || !chartRef.current) return;
    setShowPlayWidget(true);
    const initialData = ohlcData.filter(d => new Date(d.time) <= start);
    const realtimeData = ohlcData.filter(d => new Date(d.time) > start);
    chartRef.current.replayChart(initialData, realtimeData);
  };
  useEffect(() => {
    rectangleToolRef.current = new RectangleDrawingTool(chartRef.current?.getChart(), chartRef.current?.getSeries(), { showLabels: true});
    console.log("rectangleToolRef", rectangleToolRef);
  }, [chartRef, ohlcData]);

  const handleChartClick = (event: MouseEventParams) => {
    if (!rectangleToolRef.current || !event.point) return;
    console.log("Chart clicked at:", event.point);
    console.log("Current rectangles:", rectangleToolRef.current.getRectangles());
  };

  // Subscribe to chart click events for selection
  useEffect(() => {
    const chart = chartRef.current?.getChart();
    if (!chart) return;
    chart.subscribeClick(handleChartClick);
    return () => chart.unsubscribeClick(handleChartClick);
  }, [chartRef, rectangleToolRef]);


  const handleReplayClose = () => {
    setShowPlayWidget(false);
    chartRef.current?.resetChart();
  };

  const handleRectangleTool = () => {
    if (!rectangleToolRef.current) return;
    rectangleToolRef.current.buttonClick();
  };

  return (
    <main className="w-full h-full flex  container-chart">
      <Modal
        title={"Select Symbol"}
        description="Choose a symbol for your chart."
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <SelectSymbol onChange={selectSymbol} />
      </Modal>
      <div className="flex flex-1 flex-col gap-1 h-full w-full ">
        <div className="flex  py-2 px-2 gap-2 justify-start bg-card items-center border rounded-md ">

          {/* user avatar */}
          <div className="block px-2 mx-2">
            <Avatar className="gap-2">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          {/* Symbol selector */}
          <Button onClick={() => setIsOpen(true)} variant="ghost" >
            {symbol ? (
              <span className="font-semibold text-xl m-2">{symbol.symbol}</span>
            ) : (
              <span className="font-semibold text-xl m-2">Select Symbol</span>
            )}
            <Search className="size-5 m-2" />
          </Button>

          <Separator orientation="vertical" className="mx-2" />

          {/* Timeframe selector */}
          <div className="flex">
            <TimeframeSelector value={selectedTf} onChange={setSelectedTf} />
          </div>

          <Separator orientation="vertical" className="mx-2" />

          {/* indicator selector */}
          <Button variant="ghost">
            <ChartBarIncreasingIcon />
            <span className="font-semibold text-xl m-2">Indicators</span>
          </Button>

          <Separator orientation="vertical" className="mx-2" />

          {/* Alert Button */}
          <Button variant="ghost">
            <AlarmClockPlus />
            <span className="font-semibold text-xl m-2">Alerts</span>
          </Button>

          {/* Replay Button */}
          <ReplayButton startDate={startDate} endDate={endDate} onReplay={Reply} onClick={() => setShowPlayWidget(false)} timeframe={selectedTf} />

          <Separator orientation="vertical" className="mx-2" />

          {/* Date range selected */}
          <DateRangeSelector
            startDate={startDate}
            endDate={endDate}
            onChange={({ startDate, endDate }) => {
              setStartDate(startDate);
              setEndDate(endDate);
            }}
          />
        </div>

        {/* main */}
        <div className="flex flex-1  gap-1">

          <div className="flex-1 gap-2 flex">
            {/* Drawing */}
            <Card id="toolbar" className="hidden  md:flex gap-2  border rounded-md bg-card p-2">
              <Button variant="ghost" className="size-6" onClick={handleRectangleTool}>
                  <RectangleHorizontal className="size-6" />
                </Button>
            </Card>

            {/* chart */}
            <div className="flex-1 flex flex-col rounded-md gap-1 justify-between ">
              <div className="  flex flex-col flex-1 border rounded-md ">
                <ChartComponent
                  ref={chartRef}
                  data={ ohlcData}
                  decimal={symbol?.decimal}
                  symbolName={symbol?.symbol}
                  markers={swings}
                />
                <DraggablePlayWidget onClose={() => handleReplayClose()} show={showPlayWidget}
                onPlay={() => {
                  if (chartRef.current) {
                    chartRef.current?.playReplay()
                  }
                }}
                onPause={() => {
                  if (chartRef.current) {
                    chartRef.current?.pauseReplay()
                  }
                }}
                onStepBack={() => {
                  if (chartRef.current) {
                    chartRef.current?.stepBack()
                  }
                }}
                onStepForward={() => {
                  if (chartRef.current) {
                    chartRef.current?.stepForward()
                  }
                }} />
              </div>

              {/* date range */}
              <Card className="hidden md:flex  ">

              </Card>

            </div>

            {/* side menu */}
            <div className="hidden md:flex md:flex-col   gap-2 justify-start border rounded-md bg-card">
              <Button variant="ghost" className="my-2">
                <AlarmClockPlus className="size-6" />
              </Button>
              <Button variant="ghost" className="my-2">
                <Layers2 className="size-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
