interface LoadingSkeletonProps {
    className?: string;
}

export default function LoadingSkeleton({ className = "h-40" }: LoadingSkeletonProps) {
    return (
        <div
            className={`animate-pulse rounded-2xl border border-[var(--gold)]/30 bg-[var(--ivory)] p-6 shadow-lg ${className}`}
            aria-hidden="true"
        >
            <div className="h-4 w-1/3 rounded bg-[var(--sky)]/30" />
            <div className="mt-4 h-3 w-full rounded bg-[var(--sky)]/20" />
            <div className="mt-2 h-3 w-5/6 rounded bg-[var(--sky)]/20" />
            <div className="mt-2 h-3 w-2/3 rounded bg-[var(--sky)]/20" />
        </div>
    );
}
