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
    return (
        <Card
            className={`p-6 bg-[#121824] cursor-pointer transition-all duration-200 rounded-xl flex flex-col justify-between min-h-[160px]
                ${isActive
                    ? `border-2 ${activeBorderColor}`
                    : "border-2 border-transparent hover:border-gray-800/60 hover:bg-[#161f30]"
                }
            `}
            onClick={onClick}
        >
            <div className="text-gray-400 text-xl w-fit">
                {icon}
            </div>

            <div className="mt-4 space-y-1">
                <p className="text-3xl font-bold text-white tracking-tight">
                    {count > 0 && count < 10 ? `0${count}` : count}
                </p>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
            </div>
        </Card>
    );
};

export default React.memo(StatCard);