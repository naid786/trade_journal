"use client";

import { createChart, CandlestickSeries, Time, createSeriesMarkers } from 'lightweight-charts';
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { RectangleDrawingTool } from './chart/rectangle-drawing-tool';
import { time } from 'console';
import { markers } from '@/lib/indicator';
import { create } from 'domain';

interface ChartColors {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
}

export interface ChartData {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
}

interface ChartComponentProps {
    data: ChartData[];
    colors?: ChartColors;
    toolbar?: HTMLDivElement;
    decimal?: number;
    symbolName?: string;
    markers?: markers[];
}

export interface ChartComponentHandle {
    replayChart: (initialData: ChartData[], realtimeData: ChartData[]) => void;
    pauseReplay: () => void;
    playReplay: () => void;
    stepBack: () => void;
    stepForward: () => void;
    getSeries: () => any;
    getChart: () => any;
    resetChart: () => void; // Add this line
}

export const ChartComponent = forwardRef<ChartComponentHandle, ChartComponentProps>((props, ref) => {
    const {
        data,
        colors: {
            backgroundColor = 'black',
            lineColor = '#2962FF',
            textColor = 'white',
            areaTopColor = '#2962FF',
            areaBottomColor = 'rgba(41, 98, 255, 0.28)',
        } = {},
        toolbar,
        decimal,
        symbolName,
        markers
    } = props;

    const chartContainerRef = useRef<HTMLDivElement>(null);
    const replayChartRef = useRef<((initialData: ChartData[], realtimeData: ChartData[]) => void) | null>(null);

    // Replay state
    const replayState = useRef<{
        initialData: ChartData[];
        realtimeData: ChartData[];
        currentIndex: number;
        intervalID: NodeJS.Timeout | null;
        playing: boolean;
        newSeries: any;
        chart: any;
        swings: any;
        markers: markers[];
    }>({
        initialData: [],
        realtimeData: [],
        currentIndex: 0,
        intervalID: null,
        playing: false,
        newSeries: null,
        chart: null,
        swings: null,
        markers: [],
    });

    // Get the current users primary locale
    // const currentLocale = window.navigator.languages[0];
    // const myPriceFormatter =  Intl.NumberFormat(currentLocale, {}).format;
    const myPriceFormatter = (p: number) => p.toFixed(decimal);

    useImperativeHandle(ref, () => ({

        replayChart: (initialData: ChartData[], realtimeData: ChartData[]) => {
            if (replayChartRef.current) {
                replayChartRef.current(initialData, realtimeData);
            }
        },
        pauseReplay: () => {
            if (replayState.current.intervalID) {
                clearInterval(replayState.current.intervalID);
                replayState.current.intervalID = null;
                replayState.current.playing = false;
            }
        },
        playReplay: () => {
            if (!replayState.current.playing) {
                startReplayInterval();
            }
        },
        stepBack: () => {
            if (replayState.current.currentIndex > 0) {
                replayState.current.currentIndex--;
                updateReplay();
            }
        },
        stepForward: () => {
            if (replayState.current.currentIndex < replayState.current.realtimeData.length) {
                replayState.current.currentIndex++;
                updateReplay();
            }
        },
        getSeries: () => replayState.current.newSeries,
        resetChart: () => {
            const { newSeries, chart } = replayState.current;
            if (newSeries && chart) {
                newSeries.setData(
                    props.data.map(item => ({
                        ...item,
                        time: (Number(item.time) / 1000) as Time
                    }))
                );
                chart.timeScale().fitContent();
                chart.timeScale().scrollToPosition(5, true);
                replayState.current.currentIndex = 0;
                replayState.current.initialData = [...props.data];
                replayState.current.realtimeData = [];
                replayState.current.playing = false;
                if (replayState.current.intervalID) {
                    clearInterval(replayState.current.intervalID);
                    replayState.current.intervalID = null;
                }
            }
        },
        getChart: () => replayState.current.chart,
    }));

    // Helper to update chart for current replay index
    function updateReplay() {
        const { initialData, realtimeData, currentIndex, newSeries, swings, markers } = replayState.current;
        const data = [...initialData, ...realtimeData.slice(0, currentIndex)];
        newSeries.setData(data.map(item => ({
            ...item,
            time: (Number(item.time) / 1000) as Time
        })));
        // Filter and update markers for current time range
        if (swings && replayState.current.markers && replayState.current.markers.length > 0) {
            const currentTime = data.length > 0 ? Number(data[data.length - 1].time) / 1000 : 0;
            const filteredMarkers = replayState.current.markers
                .filter(marker => Number(marker.time) / 1000 <= currentTime)
                .map(marker => ({
                    time: (Number(marker.time) / 1000) as Time,
                    position: marker.position as 'aboveBar' | 'belowBar' | 'inBar',
                    color: marker.color,
                    shape: marker.shape as 'circle' | 'square' | 'arrowUp' | 'arrowDown',
                    text: marker.text
                }));
            swings.setMarkers(filteredMarkers);
        }
    }

    // Helper to start replay interval
    function startReplayInterval() {
        replayState.current.playing = true;
        replayState.current.intervalID = setInterval(() => {
            if (replayState.current.currentIndex < replayState.current.realtimeData.length) {
                replayState.current.currentIndex++;
                updateReplay();
            } else {
                clearInterval(replayState.current.intervalID!);
                replayState.current.intervalID = null;
                replayState.current.playing = false;
            }
        }, 600);
    }

    useEffect(() => {
        const handleResize = () => {
            chart.resize(chartContainerRef.current!.clientWidth, chartContainerRef.current!.parentElement!.clientHeight);
        };

        const chart = createChart(chartContainerRef.current!, {
            autoSize: false,
            localization: {
                priceFormatter: myPriceFormatter,
            },
            width: chartContainerRef.current!.clientWidth,
            height: chartContainerRef.current!.parentElement!.clientHeight,
            crosshair: {
                mode: 0,
            },
            grid: {
                horzLines: {
                    visible: true,
                },
                vertLines: {
                    visible: true,
                },
            },

            rightPriceScale: {
                autoScale: false,
                ticksVisible: true,
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.2,
                },
                borderVisible: false,
                visible: true,
            },
            timeScale: {
                borderVisible: false,
                timeVisible: true,
                secondsVisible: false,
            },
        });

        const newSeries = chart.addSeries(CandlestickSeries, {
            priceFormat: {
                type: 'price',
                minMove: 1 / Math.pow(10, decimal || 2),   // Minimum price movement = 0.00001
                precision: decimal,        // Optional: Internal precision (5 decimal places)
            },
        });
        // Add custom drawing tool

        const newData = data.map(item => {
            return {
                ...item,
                // time: new Date(item.time / 1000)
                time: (Number(item.time) / 1000) as Time
            };
        });

        newSeries.setData(newData);
        newSeries.priceScale().applyOptions({
            autoScale: false, // Disable auto-scaling
            scaleMargins: {
                top: 0.1, // 10% empty space above data
                bottom: 0.2, // 20% empty space below data
            },
        });
        const swings = createSeriesMarkers(newSeries);
        if (markers && markers.length > 0) {
            
            const seriesMarkers = markers.map(swing => ({
                    time: (Number(swing.time) / 1000) as Time,
                    position: swing.position as 'aboveBar' | 'belowBar' | 'inBar',
                    color: swing.color,
                    shape: swing.shape as 'circle' | 'square' | 'arrowUp' | 'arrowDown',
                    text: swing.text
                  }));
            swings.setMarkers(seriesMarkers);
            
        }

        replayState.current.newSeries = newSeries;
        replayState.current.chart = chart;
        replayState.current.swings = swings;
        replayState.current.markers = markers || [];

        const replayChart = (initialData: ChartData[], realtimeData: ChartData[]) => {
            replayState.current.initialData = initialData;
            replayState.current.realtimeData = realtimeData;
            replayState.current.currentIndex = 0;
            updateReplay();
            chart.timeScale().fitContent();
            chart.timeScale().scrollToPosition(5, true);
            if (replayState.current.intervalID) {
                clearInterval(replayState.current.intervalID);
            }
            startReplayInterval();
        };
        replayChartRef.current = replayChart;

        if (chartContainerRef.current && symbolName) {
            const div = document.createElement('div');
            div.style = `position: absolute; left: 0; top: 0;`;
            chartContainerRef.current.appendChild(div);

            const legend = document.createElement('div');
            legend.style = `position: absolute; left: 24px; top: 12px; z-index: 1; font-size: 14px; font-family: sans-serif; line-height: 18px; font-weight: 300;`;
            div.appendChild(legend);

            const firstRow = document.createElement('div');
            // firstRow.innerHTML = symbolName ? symbolName : '';
            firstRow.className = 'flex gap-4';
            firstRow.style.color = 'black';
            legend.appendChild(firstRow);

            chart.subscribeCrosshairMove(param => {
                let priceFormatted = null;
                // console.log("Crosshair moved:", param);
                if (param.time) {
                    const data = param.seriesData.get(newSeries);
                    const open = data && 'open' in data ? data.open : null;
                    const high = data && 'high' in data ? data.high : null;
                    const low = data && 'low' in data ? data.low : null;
                    const close = data && 'close' in data ? data.close : null;
                    priceFormatted = {
                        open: open,
                        high: high,
                        low: low,
                        close: close,
                        time: param.time
                    };
                }
                if (param.time && priceFormatted ) {
                    firstRow.innerHTML = `<span >${symbolName}</span>  <div class="flex gap-2">O<strong>${priceFormatted.open}</strong>H<strong>${priceFormatted.high}</strong>L<strong>${priceFormatted.low}</strong>C<strong>${priceFormatted.close}</strong> </div>
                    <span>${new Date(Number(priceFormatted.time) * 1000).toLocaleString()}</span>`;
                }
            });
        }

        chart.timeScale().fitContent();
        window.addEventListener('resize', handleResize);

        return () => {
            if (replayState.current.intervalID) {
                clearInterval(replayState.current.intervalID);
            }
            chart.remove();
        };
    }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);

    return (
        <div ref={chartContainerRef} className='rounded-md relative bg-card flex p-1 h-full '>
        </div>

    );
});


