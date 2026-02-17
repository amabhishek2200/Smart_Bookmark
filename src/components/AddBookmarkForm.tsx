'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { Plus, Loader2 } from 'lucide-react'

interface AddBookmarkFormProps {
    onAdd: (bookmark: any) => void
}

export default function AddBookmarkForm({ onAdd }: AddBookmarkFormProps) {
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !url) return

        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user found')

            const { data, error } = await supabase
                .from('bookmarks')
                .insert([{ title, url, user_id: user.id }])
                .select()
                .single()

            if (error) throw error

            if (data) {
                onAdd(data)
            }

            setTitle('')
            setUrl('')
        } catch (error) {
            console.error('Error adding bookmark:', error)
            alert('Error adding bookmark')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Add New Bookmark</h2>
            <div className="flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Title (e.g., Google)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                    required
                />
                <input
                    type="url"
                    placeholder="URL (e.g., https://google.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    Add
                </button>
            </div>
        </form>
    )
}
