import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface InputProps extends Omit<HTMLMotionProps<"input">, 'ref'> {
    icon?: React.ReactNode
    noGlow?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, icon, noGlow = false, ...props }, ref) => {
        return (
            <div className="relative group">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                        {icon}
                    </div>
                )}
                <motion.input
                    ref={ref}
                    whileFocus={{ scale: 1.01 }}
                    className={cn(
                        "w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-300 shadow-inner backdrop-blur-sm",
                        !noGlow && "input-glow",
                        icon && "pl-10",
                        className
                    )}
                    {...props}
                />
            </div>
        )
    }
)
Input.displayName = 'Input'
