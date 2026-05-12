import React from 'react'

export const BrandBar = ({
    name,
    value,
    color,
}: {
    name: string;
    value: number;
    color?: string;
}) => {
    return (
        <div className="flex items-center gap-2 text-sm">
            <span className="w-20 text-foreground-subtle">{name}</span>

            <div className="flex-1 h-2 bg-surface-hover rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full"
                    style={{
                        width: `${value}%`,
                        background: color ?? "var(--primary)",
                    }}
                />
            </div>

            <span className="w-10 text-right text-foreground-subtle">
                {value}%
            </span>
        </div>
    )
}