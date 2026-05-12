import React from "react";

export const DashboardCard = ({
    title,
    value,
    change,
    trend,
    className = "",
}: {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    className?: string;
}) => {
    return (
        <div
            className={`rounded-3xl border border-border-subtle bg-surface-glass backdrop-blur-xl p-6 ${className}`}
        >
            <p className="text-sm text-foreground-subtle">{title}</p>

            <div className="mt-2 text-3xl font-black text-foreground">
                {value}
            </div>

            <p
                className={`mt-2 text-xs ${trend === "up" ? "text-green-400" : "text-red-400"
                    }`}
            >
                {change}
            </p>
        </div>
    );
};