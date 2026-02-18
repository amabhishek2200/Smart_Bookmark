'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SkeletonProps {
    className?: string
    variant?: 'circular' | 'rectangular' | 'text'
    width?: string | number
    height?: string | number
}

export function Skeleton({ className, variant = 'rectangular', width, height }: SkeletonProps) {
    const baseStyles = 'bg-white/5 animate-pulse'

    const variants = {
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
        text: 'rounded h-4'
    }

    return (
        <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: 'reverse'
            }}
            className={cn(baseStyles, variants[variant], className)}
            style={{
                width: width,
                height: height
            }}
        />
    )
}

export function BookmarkCardSkeleton() {
    return (
        <div className="glass-card rounded-xl p-4 h-48">
            <div className="flex justify-between items-start">
                <Skeleton variant="rectangular" width={48} height={48} className="rounded-xl" />
                <Skeleton variant="rectangular" width={32} height={32} className="rounded-full" />
            </div>
            <div className="mt-4 space-y-2">
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" className="opacity-50" />
            </div>
            <div className="mt-auto pt-4">
                <Skeleton variant="rectangular" width={32} height={32} className="ml-auto rounded" />
            </div>
        </div>
    )
}

export function BookmarkListSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
                <BookmarkCardSkeleton key={i} />
            ))}
        </div>
    )
}

export function FormSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton variant="rectangular" width="100%" height={56} className="rounded-lg" />
            <Skeleton variant="rectangular" width={120} height={40} className="rounded-lg" />
        </div>
    )
}
