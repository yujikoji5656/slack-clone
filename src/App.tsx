import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Menu, Pencil, Smile, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  messages as initialMessages,
  type Channel,
  type Message,
} from '@/data/messages'
import { dms } from '@/data/dms'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

type SelectedItem =
  | { type: 'channel'; id: string }
  | { type: 'dm'; id: string }

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '🎉', '😮']

type SidebarContentProps = {
  channels: Channel[]
  selectedItem: SelectedItem | null
  onSelect: (item: SelectedItem) => void
  joinedChannelIds: Set<string>
  canManage: boolean
  onJoin: (channelId: string) => void
  onLeave: (channelId: string) => void
}

function SidebarContent({
  channels,
  selectedItem,
  onSelect,
  joinedChannelIds,
  canManage,
  onJoin,
  onLeave,
}: SidebarContentProps) {
  const isSelected = (item: SelectedItem) =>
    selectedItem?.type === item.type && selectedItem?.id === item.id

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b border-white/10">
        <h1 className="text-lg font-bold">My Workspace</h1>
      </div>
      <div className="px-2 py-3 flex flex-col gap-1">
        <div className="px-3 py-1 text-xs uppercase tracking-wide text-white/70">
          チャンネル
        </div>
        <ul className="flex flex-col">
          {channels.map((c) => {
            const selected = isSelected({ type: 'channel', id: c.id })
            const joined = joinedChannelIds.has(c.id)
            return (
              <li
                key={c.id}
                onClick={() => onSelect({ type: 'channel', id: c.id })}
                className={`h-8 px-3 rounded text-sm flex items-center gap-2 cursor-pointer ${
                  selected ? 'bg-[#1264A3] text-white' : 'hover:bg-white/10'
                }`}
              >
                <span className="text-white/70">#</span>
                <span className="flex-1 truncate">{c.name}</span>
                {canManage && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-6 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (joined) onLeave(c.id)
                      else onJoin(c.id)
                    }}
                  >
                    {joined ? '退出する' : '参加する'}
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
      </div>
      <div className="px-2 pb-3 flex flex-col gap-1">
        <div className="px-3 py-2 text-xs uppercase tracking-wide opacity-70">
          ダイレクトメッセージ
        </div>
        <ul className="flex flex-col">
          {dms.map((d) => {
            const selected = isSelected({ type: 'dm', id: d.id })
            return (
              <li
                key={d.id}
                onClick={() => onSelect({ type: 'dm', id: d.id })}
                className={`h-8 px-3 rounded text-sm flex items-center gap-2 cursor-pointer ${
                  selected ? 'bg-[#1264A3] text-white' : 'hover:bg-white/10'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    d.online ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                />
                <span>{d.name}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function Sidebar(props: SidebarContentProps) {
  return (
    <aside className="hidden md:flex w-[260px] flex-shrink-0 bg-[#611f69] text-white flex-col">
      <SidebarContent {...props} />
    </aside>
  )
}

function ChannelHeader({
  channels,
  selectedItem,
  onMenuClick,
  onLogout,
}: {
  channels: Channel[]
  selectedItem: SelectedItem | null
  onMenuClick: () => void
  onLogout: () => void
}) {
  const label = !selectedItem
    ? ''
    : selectedItem.type === 'channel'
      ? `# ${channels.find((c) => c.id === selectedItem.id)?.name ?? ''}`
      : `@ ${dms.find((d) => d.id === selectedItem.id)?.name ?? ''}`

  return (
    <header className="px-4 md:px-6 py-4 border-b flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="メニューを開く"
      >
        <Menu className="size-5" />
      </Button>
      <h2 className="text-xl font-bold">{label}</h2>
      <Button
        variant="destructive"
        size="sm"
        className="ml-auto"
        onClick={onLogout}
      >
        ログアウト
      </Button>
    </header>
  )
}

function MessageList({
  items,
  endRef,
  onEdit,
  onDelete,
  onReact,
}: {
  items: Message[]
  endRef: React.RefObject<HTMLDivElement | null>
  onEdit: (id: string, body: string) => void
  onDelete: (id: string) => void
  onReact: (id: string, emoji: string) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const startEdit = (m: Message) => {
    setEditingId(m.id)
    setEditText(m.body)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const saveEdit = (id: string) => {
    onEdit(id, editText)
    setEditingId(null)
    setEditText('')
  }

  const handleDelete = (id: string) => {
    if (window.confirm('削除しますか？')) {
      onDelete(id)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
      {items.map((m) => (
        <div key={m.id} className="group relative flex gap-3">
          <Avatar>
            <AvatarFallback>{getInitials(m.userName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold">{m.userName}</span>
              <span className="text-xs text-muted-foreground">
                {formatTime(m.createdAt)}
              </span>
            </div>
            {editingId === m.id ? (
              <div className="mt-1 flex flex-col gap-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full text-sm border rounded p-2 resize-y min-h-16"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => saveEdit(m.id)}>
                    保存
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                    キャンセル
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm">{m.body}</p>
            )}
            {Object.entries(m.reactions).filter(([, count]) => count > 0)
              .length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {Object.entries(m.reactions)
                  .filter(([, count]) => count > 0)
                  .map(([emoji, count]) => (
                    <Badge
                      key={emoji}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => onReact(m.id, emoji)}
                    >
                      <span>{emoji}</span>
                      <span className="ml-1">{count}</span>
                    </Badge>
                  ))}
              </div>
            )}
          </div>
          {editingId !== m.id && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    aria-label="リアクション"
                  >
                    <Smile className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-1 flex gap-1">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => onReact(m.id, emoji)}
                      className="h-8 w-8 text-lg rounded hover:bg-muted"
                      aria-label={`${emoji} を追加`}
                    >
                      {emoji}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => startEdit(m)}
                aria-label="編集"
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleDelete(m.id)}
                aria-label="削除"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          )}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  )
}

function MessageInput({
  input,
  setInput,
  onSend,
}: {
  input: string
  setInput: (v: string) => void
  onSend: () => void
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="sticky bottom-0 border-t bg-background px-6 py-3 flex gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="メッセージを送信"
        className="flex-1"
      />
      <Button onClick={onSend}>送信</Button>
    </div>
  )
}

type ChannelMessageRow = {
  id: string
  channel_id: string
  user_name: string
  content: string
  created_at: string
  user_id: string | null
}

function rowToMessage(r: ChannelMessageRow): Message {
  return {
    id: r.id,
    type: 'channel',
    parentId: r.channel_id,
    userName: r.user_name,
    body: r.content,
    createdAt: r.created_at,
    reactions: {},
    userId: r.user_id,
  }
}

export default function App() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [joinedChannelIds, setJoinedChannelIds] = useState<Set<string>>(
    new Set()
  )
  const endRef = useRef<HTMLDivElement>(null)
  const userId = session?.user.id ?? null

  const selectedChannelId =
    selectedItem?.type === 'channel' ? selectedItem.id : null

  const visibleMessages = selectedItem
    ? messages.filter(
        (m) =>
          m.type === selectedItem.type && m.parentId === selectedItem.id
      )
    : []

  const fetchChannels = async () => {
    const { data, error } = await supabase.from('channels').select('*')
    if (error) {
      console.error(error)
      return
    }
    const list = (data ?? []) as Channel[]
    setChannels(list)
    setSelectedItem((prev) =>
      prev ?? (list[0] ? { type: 'channel', id: list[0].id } : null)
    )
  }

  const fetchJoinedChannels = async (uid: string) => {
    const { data, error } = await supabase
      .from('channel_members')
      .select('channel_id')
      .eq('user_id', uid)
    if (error) {
      console.error(error)
      return
    }
    setJoinedChannelIds(
      new Set((data ?? []).map((r) => r.channel_id as string))
    )
  }

  useEffect(() => {
    fetchChannels()
  }, [])

  useEffect(() => {
    if (!userId) {
      setJoinedChannelIds(new Set())
      return
    }
    fetchJoinedChannels(userId)
  }, [userId])

  const loadChannelMessages = async (channelId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true })
    if (error) {
      console.error(error)
      return
    }
    const mapped: Message[] = ((data ?? []) as ChannelMessageRow[]).map(
      rowToMessage
    )
    setMessages(mapped)
  }

  useEffect(() => {
    if (!selectedChannelId) return
    loadChannelMessages(selectedChannelId)

    const channel = supabase
      .channel(`messages:${selectedChannelId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('realtime payload', payload)
          const row = payload.new as ChannelMessageRow
          if (row.channel_id !== selectedChannelId) return
          const message = rowToMessage(row)
          setMessages((prev) =>
            prev.some((m) => m.id === message.id) ? prev : [...prev, message]
          )
        }
      )
      .subscribe((status) => {
        console.log('channel status', status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedChannelId])

  useEffect(() => {
    if (selectedItem?.type === 'dm') {
      setMessages(
        initialMessages.filter(
          (m) => m.type === 'dm' && m.parentId === selectedItem.id
        )
      )
    }
  }, [selectedItem])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !selectedItem) return

    if (selectedItem.type === 'channel') {
      const text = input
      setInput('')
      const { error } = await supabase.from('messages').insert({
        content: text,
        channel_id: selectedItem.id,
        user_name: '自分',
        user_id: session?.user.id ?? null,
      })
      if (error) {
        console.error(error)
        return
      }
      return
    }

    const newMessage: Message = {
      id: crypto.randomUUID(),
      type: selectedItem.type,
      parentId: selectedItem.id,
      userName: '自分',
      body: input,
      createdAt: new Date().toISOString(),
      reactions: {},
    }
    setMessages((prev) => [...prev, newMessage])
    setInput('')
  }

  const handleEdit = (id: string, body: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, body } : m))
    )
  }

  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  const refreshAfterMembershipChange = async () => {
    if (!userId) return
    await Promise.all([
      fetchChannels(),
      fetchJoinedChannels(userId),
      selectedChannelId
        ? loadChannelMessages(selectedChannelId)
        : Promise.resolve(),
    ])
  }

  const handleJoinChannel = async (channelId: string) => {
    if (!userId) return
    const { error } = await supabase
      .from('channel_members')
      .insert({ channel_id: channelId, user_id: userId })
      .select()
    if (error) {
      toast.error(error.message)
      return
    }
    await refreshAfterMembershipChange()
  }

  const handleLeaveChannel = async (channelId: string) => {
    if (!userId) return
    const { error } = await supabase
      .from('channel_members')
      .delete()
      .eq('channel_id', channelId)
      .eq('user_id', userId)
    if (error) {
      toast.error(error.message)
      return
    }
    await refreshAfterMembershipChange()
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
      return
    }
    navigate('/login', { replace: true })
  }

  const handleReact = (id: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              reactions: {
                ...m.reactions,
                [emoji]: (m.reactions[emoji] ?? 0) + 1,
              },
            }
          : m
      )
    )
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar
        channels={channels}
        selectedItem={selectedItem}
        onSelect={setSelectedItem}
        joinedChannelIds={joinedChannelIds}
        canManage={!!userId}
        onJoin={handleJoinChannel}
        onLeave={handleLeaveChannel}
      />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="left"
          className="w-[260px] bg-[#611f69] text-white p-0"
        >
          <SidebarContent
            channels={channels}
            selectedItem={selectedItem}
            onSelect={setSelectedItem}
            joinedChannelIds={joinedChannelIds}
            canManage={!!userId}
            onJoin={handleJoinChannel}
            onLeave={handleLeaveChannel}
          />
        </SheetContent>
      </Sheet>
      <main className="flex-1 flex flex-col">
        <ChannelHeader
          channels={channels}
          selectedItem={selectedItem}
          onMenuClick={() => setIsOpen(true)}
          onLogout={handleLogout}
        />
        <MessageList
          items={visibleMessages}
          endRef={endRef}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReact={handleReact}
        />
        <MessageInput input={input} setInput={setInput} onSend={handleSend} />
      </main>
    </div>
  )
}
