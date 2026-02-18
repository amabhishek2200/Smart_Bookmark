'use client'

import { Trash2, Globe, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { Card } from './ui/Card'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/Button'
import { Bookmark } from '@/types'

interface BookmarkListProps {
    bookmarks: Bookmark[]
    onDelete: (id: string) => void
    searchQuery?: string
}

export default function BookmarkList({ bookmarks, onDelete, searchQuery = '' }: BookmarkListProps) {
    if (bookmarks.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
            >
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                    />
                    <div className="relative z-10 w-20 h-20 rounded-full bg-surface/50 border border-border flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-sm">
                        {searchQuery ? (
                            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        ) : (
                            <Globe className="w-10 h-10 text-gray-400" />
                        )}
                    </div>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                    {searchQuery ? 'No results found' : 'No bookmarks yet'}
                </h3>
                <p className="text-gray-500">
                    {searchQuery 
                        ? `We couldn't find any bookmarks matching "${searchQuery}". Try a different search term.`
                        : 'Paste a URL above to start your collection.'
                    }
                </p>
            </motion.div>
        )
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <motion.div
            layout
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
            <AnimatePresence mode="popLayout">
                {bookmarks.map((bookmark) => {
                    let hostname = 'unknown'
                    try {
                        hostname = new URL(bookmark.url).hostname
                    } catch (e) {
                        // ignore invalid urls
                    }
                    const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${bookmark.url}`

                    return (
                        <Card
                            key={bookmark.id}
                            layout
                            variants={item}
                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                            className="group flex flex-col justify-between h-48"
                        >
                            <div className="flex justify-between items-start relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 p-2 flex items-center justify-center shadow-inner">
                                    <Image
                                        src={faviconUrl}
                                        alt=""
                                        width={24}
                                        height={24}
                                        className="object-contain w-6 h-6"
                                        unoptimized
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.1, color: "#ef4444" }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        onDelete(bookmark.id)
                                    }}
                                    className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/5 rounded-full"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </motion.button>
                            </div>

                            <div className="mt-4">
                                <h3 className="font-semibold text-white truncate text-lg mb-1 leading-tight group-hover:text-primary transition-colors">
                                    {bookmark.title || hostname}
                                </h3>
                                <p className="text-sm text-gray-500 truncate font-mono opacity-70">
                                    {hostname}
                                </p>
                            </div>

                            <div className="mt-auto pt-4 flex justify-end">
                                <a
                                    href={bookmark.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 z-0"
                                    aria-label={`Visit ${bookmark.title}`}
                                />
                                <ExternalLink className="w-4 h-4 text-gray-700 group-hover:text-primary transition-colors transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300" />
                            </div>
                        </Card>
                    )
                })}
            </AnimatePresence>
        </motion.div>
    )
}
