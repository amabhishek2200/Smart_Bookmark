import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { Plus, Command, Check } from 'lucide-react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark } from '@/types'

interface AddBookmarkFormProps {
    onAdd: (bookmark: Bookmark) => void
}

export default function AddBookmarkForm({ onAdd }: AddBookmarkFormProps) {
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(false), 2000)
            return () => clearTimeout(timer)
        }
    }, [success])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!url) return

        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user found')

            // Basic title extraction
            const title = new URL(url).hostname.replace('www.', '')

            const { data, error } = await supabase
                .from('bookmarks')
                .insert([{ title, url, user_id: user.id }])
                .select()
                .single()

            if (error) throw error

            if (data) {
                onAdd(data)
                setSuccess(true)
            }

            setUrl('')
        } catch (error) {
            console.error('Error adding bookmark:', error)
            // Ideally use a toast notification here
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-20 w-full max-w-2xl mx-auto mb-12"
        >
            <form onSubmit={handleSubmit} className="relative">
                <div
                    className={`absolute -inset-1 rounded-lg bg-gradient-to-r from-primary to-secondary opacity-0 transition-opacity duration-500 blur ${isFocused ? 'opacity-50' : 'group-hover:opacity-30'}`}
                />

                <div className="relative flex items-center gap-2 p-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                    <div className="pl-3 text-gray-400">
                        <Command className="w-5 h-5" />
                    </div>

                    <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Paste a URL to add..."
                        className="flex-1 border-none bg-transparent shadow-none focus:ring-0 text-lg py-4"
                        autoFocus
                        noGlow
                    />

                    <Button
                        type="submit"
                        isLoading={loading}
                        disabled={!url || loading}
                        className={`mr-1 transition-all duration-300 ${success ? 'bg-green-500 hover:bg-green-600 text-black' : ''}`}
                        size="md"
                    >
                        {success ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </Button>
                </div>
            </form>

            <AnimatePresence>
                {isFocused && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -bottom-8 left-0 right-0 text-center text-xs text-gray-500 font-mono"
                    >
                        Press <span className="text-primary">Enter</span> to save
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
