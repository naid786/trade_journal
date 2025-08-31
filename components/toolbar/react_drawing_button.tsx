import { RectangleCircleIcon } from "lucide-react";
import { Button } from "../ui/button";

const ReactDrawingButton = ({ isDrawing ,onToggle}:{ isDrawing: boolean; onToggle: () => void; }) => {
    return (
        <Button
            variant="ghost"
            onClick={onToggle}
        >
            <RectangleCircleIcon />
        </Button>
    );
}

export default ReactDrawingButton;