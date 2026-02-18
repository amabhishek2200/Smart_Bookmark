import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    children: ReactNode
    isLoading?: boolean
}

export const Button = ({
    className,
    variant = 'primary',
    size = 'md',
    children,
    isLoading,
    ...props
}: ButtonProps) => {
    const baseStyles = "relative inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"

    const variants = {
        primary: "bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] border border-primary/50 relative overflow-hidden group",
        secondary: "bg-surface hover:bg-surface-hover text-white border border-border hover:border-border-hover",
        ghost: "bg-transparent hover:bg-white/5 text-gray-400 hover:text-white",
        danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
    }

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {variant === 'primary' && (
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:animate-shine pointer-events-none">
                    <div className="relative h-full w-8 bg-white/20" />
                </div>
            )}
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2 relative z-10" />
            ) : null}
            <span className="relative z-10">{children}</span>
        </motion.button>
    )
}
