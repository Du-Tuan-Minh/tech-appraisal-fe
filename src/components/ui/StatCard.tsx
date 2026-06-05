import React from "react";
import Card from "../../components/ui/Card";

interface StatCardProps {
    title: string;
    count: number;
    icon: React.ReactNode;
    isActive?: boolean;
    activeBorderColor?: string;
    onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    count,
    icon,
    isActive = false,
    activeBorderColor = "border-purple-500",
    onClick,
}) => {
    const cardStyles = [
        "p-6 bg-[#121824] cursor-pointer transition-all duration-200 rounded-xl",
        "flex flex-col justify-start gap-4 min-h-[160px]",
        isActive ? `border-2 ${activeBorderColor}` : "border-2 border-transparent hover:border-gray-800/60 hover:bg-[#161f30]"
    ].join(" ");

    return (
        <Card className={cardStyles} onClick={onClick}>
            <div className="text-gray-400 text-xl w-fit flex-shrink-0 select-none">
                {icon}
            </div>

            <div className="flex flex-col gap-1 w-full min-w-0">
                <p className="text-3xl font-bold text-white tracking-tight leading-none select-none">
                    {count > 0 && count < 10 ? `0${count}` : count}
                </p>

                <p className="text-gray-500 text-sm font-medium leading-relaxed break-words">
                    {title}
                </p>
            </div>
        </Card>
    );
};

export default React.memo(StatCard);