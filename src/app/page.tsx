'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import AddBookmarkForm from '@/components/AddBookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import { Bookmark as BookmarkIcon, Sparkles, LogOut, Search, Keyboard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Bookmark } from '@/types'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showShortcuts, setShowShortcuts] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Filter bookmarks based on search query
  const filteredBookmarks = useMemo(() => {
    if (!searchQuery.trim()) return bookmarks
    const query = searchQuery.toLowerCase()
    return bookmarks.filter(
      (bookmark) =>
        bookmark.title?.toLowerCase().includes(query) ||
        bookmark.url?.toLowerCase().includes(query)
    )
  }, [bookmarks, searchQuery])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        fetchBookmarks()
      }
      setLoading(false)
    }

    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login')
      } else if (session) {
        setUser(session.user)
        fetchBookmarks()
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router, supabase])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('search-input')?.focus()
      }
      // Cmd/Ctrl + / to show shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault()
        setShowShortcuts((prev) => !prev)
      }
      // Escape to clear search
      if (e.key === 'Escape') {
        setSearchQuery('')
        setShowShortcuts(false)
        document.getElementById('search-input')?.blur()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookmarks(data || [])
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleAddBookmark = (newBookmark: Bookmark) => {
    setBookmarks((prev) => [newBookmark, ...prev])
  }

  const handleDeleteBookmark = async (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id))

    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error deleting bookmark:', error)
      fetchBookmarks()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen text-foreground selection:bg-primary/30 selection:text-white overflow-hidden">

      {/* Floating Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none"
      >
        <div className="glass-panel rounded-full px-6 py-3 flex items-center gap-6 pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-primary to-secondary p-1.5 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <BookmarkIcon className="w-4 h-4 text-black" />
            </div>
            <span className="text-sm font-bold tracking-wide">ASTRA</span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
              <span className="text-xs text-gray-400 max-w-[150px] truncate">{user.email}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-400 hover:text-white !p-1"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-40 pb-20 relative z-10">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center justify-center mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-white/5 mb-6">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Next Gen Bookmarking</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 tracking-tight mb-6 pb-2 neon-text">
            Command Your Web
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-xl leading-relaxed">
            The minimalist workspace for your digital life. <br className="hidden md:block" />
            Everything you need, exactly where you left it.
          </p>
        </motion.div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-2xl mx-auto relative z-20"
        >
          <AddBookmarkForm onAdd={handleAddBookmark} />
        </motion.div>

        {/* Search Bar & Shortcuts Hint */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto mt-6 relative z-20"
        >
          <div className="relative">
            <Input
              id="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookmarks..."
              icon={<Search className="w-5 h-5" />}
              className="pl-10 pr-20"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-[10px] text-gray-500 bg-white/5 rounded border border-white/10">
                <span className="text-xs">⌘</span>K
              </kbd>
              <button
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="p-1.5 text-gray-500 hover:text-white transition-colors rounded hover:bg-white/5"
              >
                <Keyboard className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Keyboard Shortcuts Panel */}
          <AnimatePresence>
            {showShortcuts && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 p-4 glass-panel rounded-xl border border-white/10 z-50"
              >
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Keyboard Shortcuts</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Search bookmarks</span>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 text-xs bg-white/10 rounded border border-white/10">⌘</kbd>
                      <kbd className="px-2 py-0.5 text-xs bg-white/10 rounded border border-white/10">K</kbd>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Show shortcuts</span>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 text-xs bg-white/10 rounded border border-white/10">⌘</kbd>
                      <kbd className="px-2 py-0.5 text-xs bg-white/10 rounded border border-white/10">/</kbd>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Clear search</span>
                    <kbd className="px-2 py-0.5 text-xs bg-white/10 rounded border border-white/10">Esc</kbd>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bookmarks Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 border-t border-white/5 pt-12"
        >
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest">Library</h2>
              {searchQuery && (
                <span className="text-xs text-gray-500">
                  Showing {filteredBookmarks.length} of {bookmarks.length} results
                </span>
              )}
            </div>
            <div className="px-2 py-1 rounded bg-surface border border-white/5 text-[10px] text-gray-500 font-mono">
              {searchQuery ? `${filteredBookmarks.length}/` : ''}{bookmarks.length} ITEMS
            </div>
          </div>

          <BookmarkList 
            bookmarks={filteredBookmarks} 
            onDelete={handleDeleteBookmark}
            searchQuery={searchQuery}
          />
        </motion.div>
      </main>

      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -30, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            opacity: [0, 0.2, 0],
            scale: [0.8, 1, 0.8],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-[100px]"
        />
      </div>
    </div>
  )
}

