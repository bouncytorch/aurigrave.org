'use client';

export default function LocalTime({ date }: { date: Date | string }) {
    const d = new Date(date);
    return (
        <span suppressHydrationWarning>
            {d.toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            })}
        </span>
    );
}
