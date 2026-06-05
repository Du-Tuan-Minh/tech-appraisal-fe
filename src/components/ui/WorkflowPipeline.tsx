import React from "react";

export interface PipelineItem {
    key: string;
    label: string;
    count: number;
    onClick?: () => void;
}

interface WorkflowPipelineProps {
    items: PipelineItem[];
}

export const WorkflowPipeline: React.FC<WorkflowPipelineProps> = ({ items }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-0 max-w-5xl mx-auto">
            {items.map((step, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div key={step.key} className="flex-1 w-full group">
                        <div className="flex items-center w-full">
                            <div
                                onClick={step.onClick}
                                className="w-12 h-12 rounded-full border border-gray-700 bg-[#161f30] flex items-center justify-center flex-shrink-0 cursor-pointer transition-all group-hover:border-purple-500 group-hover:bg-[#1c263b] z-10 select-none"
                            >
                                <span className="text-sm font-bold text-white">
                                    {step.count}
                                </span>
                            </div>

                            {!isLast ? (
                                <div className="hidden md:block h-[1px] bg-gray-800 flex-1 w-full" />
                            ) : (
                                <div className="hidden md:block flex-1 w-full invisible" />
                            )}
                        </div>

                        <div className="mt-3 text-left pr-4">
                            <span
                                onClick={step.onClick}
                                className="text-xs font-semibold text-gray-400 tracking-wide inline-block cursor-pointer whitespace-nowrap group-hover:text-purple-400 transition-colors select-none"
                            >
                                {step.label}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default React.memo(WorkflowPipeline);