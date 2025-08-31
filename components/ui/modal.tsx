"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog";

interface ModalProps {
    title: string;
    description?: string;
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    title,
    description,
    isOpen,
    onClose,
    children,
}) => {
    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onChange}  >
            <DialogContent className="bg-white p-6 rounded-lg shadow-md">
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    {
                        description && (
                            <DialogDescription>
                                {description}
                            </DialogDescription>
                        )
                    }
                </DialogHeader>
                <div>
                    {children}
                </div>
            </DialogContent>

        </Dialog>
    )
}