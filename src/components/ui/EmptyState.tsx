'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
    icon?: ReactNode
    title: string
    description?: string
    action?: ReactNode
    className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('flex flex-col items-center justify-center py-20 px-4', className)}
        >
            {icon && (
                <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                    {/* Glow Effect */}
                    <motion.div
                        animate={{ 
                            scale: [1, 1.2, 1], 
                            opacity: [0.3, 0.6, 0.3] 
                        }}
                        transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                        className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                    />
                    {/* Icon Container */}
                    <div className="relative z-10 w-24 h-24 rounded-2xl bg-surface/50 border border-border flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-sm">
                        {icon}
                    </div>
                </div>
            )}
            
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            {description && (
                <p className="text-gray-500 text-center max-w-md mb-6">{description}</p>
            )}
            {action && (
                <div className="mt-2">
                    {action}
                </div>
            )}
        </motion.div>
    )
}

// Pre-built Empty States
export function NoBookmarksState({ onAdd }: { onAdd?: () => void }) {
    return (
        <EmptyState
            icon={
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
            }
            title="No bookmarks yet"
            description="Start building your digital library by adding your first bookmark."
            action={
                onAdd && (
                    <button
                        onClick={onAdd}
                        className="px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm font-medium"
                    >
                        Add your first bookmark
                    </button>
                )
            }
        />
    )
}

export function NoSearchResultsState({ query }: { query: string }) {
    return (
        <EmptyState
            icon={
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            }
            title="No results found"
            description={`We couldn't find any bookmarks matching "${query}". Try a different search term.`}
        />
    )
}
