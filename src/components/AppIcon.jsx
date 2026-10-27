import React from 'react';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';

function Icon({
    name,
    size = 24,
    color = "currentColor",
    className = "",
    strokeWidth = 2,
    ...props
}) {
    if (name === 'Anchor') {
        const padding = size <= 24 ? 3 : size <= 32 ? 4 : size <= 40 ? 6 : 8;
        return (
            <span
                className={`inline-flex items-center justify-center rounded-lg bg-slate-900 dark:bg-zinc-800 shadow-sm border border-slate-800/10 dark:border-zinc-700/50 flex-shrink-0 ${className}`}
                style={{
                    width: size,
                    height: size,
                    padding: `${padding}px`,
                    boxSizing: 'border-box'
                }}
            >
                <img
                    src="/app_icon.png"
                    alt="Anchor"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    {...props}
                />
            </span>
        );
    }

    const IconComponent = LucideIcons?.[name];

    if (!IconComponent) {
        return <HelpCircle size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
    }

    return <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
        {...props}
    />;
}
export default Icon;