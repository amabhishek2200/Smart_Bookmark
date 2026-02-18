import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface CardProps extends HTMLMotionProps<"div"> {
    children: ReactNode
    hoverEffect?: boolean
}

export const Card = ({ className, children, hoverEffect = true, ...props }: CardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={hoverEffect ? { y: -4 } : undefined}
            className={cn(
                "glass-card rounded-xl p-4 relative overflow-hidden group !border-transparent",
                className
            )}
            {...props}
        >
            {/* Animated Gradient Border */}
            <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-white/10 via-transparent to-transparent group-hover:from-primary/50 group-hover:via-secondary/20 group-hover:to-primary/50 transition-all duration-500 pointer-events-none -z-10" />

            {/* Spotlight Gradient */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-out]" />
            </div>

            {/* Decorative gradient blob */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-all duration-500 group-hover:bg-primary/20 opacity-0 group-hover:opacity-100" />

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    )
}
