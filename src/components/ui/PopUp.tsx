import React from "react";
import Card from "./Card";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
};

const PopUp = ({ isOpen, onClose, title, children }: Props) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <Card className="relative z-10 w-full max-w-lg p-6 shadow-neon-green border-primary-500/30">
                <div className="flex items-center justify-between mb-6 border-b border-dark-700 pb-4">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-primary-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {children}
            </Card>
        </div>
    );
};

export default PopUp;