'use client'

import { Trash2, ExternalLink } from 'lucide-react'

type Bookmark = {
    id: string
    title: string
    url: string
    created_at: string
    user_id: string
}



interface BookmarkListProps {
    bookmarks: Bookmark[]
    onDelete: (id: string) => void
}

export default function BookmarkList({ bookmarks, onDelete }: BookmarkListProps) {
    if (bookmarks.length === 0) {
        return <div className="text-center py-8 text-gray-500">No bookmarks yet. Add one above!</div>
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate pr-2" title={bookmark.title}>
                            {bookmark.title}
                        </h3>
                        <button
                            onClick={() => onDelete(bookmark.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            aria-label="Delete bookmark"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1 break-all"
                    >
                        Visit Link <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            ))}
        </div>
    )
}
