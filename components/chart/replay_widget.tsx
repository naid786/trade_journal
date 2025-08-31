"use client";
    
import { GripVertical, Pause, Play, StepBack, StepForward, X } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { is } from "date-fns/locale";

// Simple draggable play widget
function DraggablePlayWidget({ onClose, show, onPlay, onPause, onStepBack, onStepForward }: { onClose: () => void, show: boolean, onPlay: () => void, onPause: () => void, onStepBack: () => void, onStepForward: () => void }) {
    const [pos, setPos] = useState({ x: 100, y: 100 });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isPlaying, setIsPlaying] = useState(true);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault(); // Disable default drag/select behavior
        setDragging(true);
        setOffset({
            x: e.clientX - pos.x,
            y: e.clientY - pos.y,
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (dragging) {
            setPos({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
            });
        }
    };

    const handleMouseUp = () => setDragging(false);

    // Attach/detach mousemove/up listeners
    useEffect(() => {
        if (dragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    });

    const handleStepBack = () => {
        setIsPlaying(false);
        onPause();
        onStepBack();
    };

    const handleStepForward = () => {
        setIsPlaying(false);
        onPause();
        onStepForward();
    };

    const handlePlay = () => {
        if (isPlaying) {
            onPause();
        } else {
            onPlay();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        !show ? null :
        <div
            style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                zIndex: 9999,
                cursor: "grab",
                background: "white",
                border: "1px solid #ccc",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                padding: "12px 12px 12px 0px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                minWidth: "120px"
            }}
            
        >
            <div onMouseDown={handleMouseDown}>
                <GripVertical />
            </div>

            <Button variant="ghost" onClick={handleStepBack}>
                <StepBack />
            </Button>
            <Button variant="ghost" onClick={handlePlay}>
                {isPlaying ? <Pause /> : <Play />}
            </Button>
            <Button variant="ghost" onClick={handleStepForward}>
                <StepForward />
            </Button>
            <Button variant="ghost" onClick={onClose}><X/></Button>
        </div>
    );
}

export default DraggablePlayWidget;