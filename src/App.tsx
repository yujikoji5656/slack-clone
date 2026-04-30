import { useEffect, useRef, useState } from 'react'
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
  channels,
  messages as initialMessages,
  type Message,
} from '@/data/messages'
import { dms } from '@/data/dms'

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
  selectedItem: SelectedItem
  onSelect: (item: SelectedItem) => void
}

function SidebarContent({ selectedItem, onSelect }: SidebarContentProps) {
  const isSelected = (item: SelectedItem) =>
    selectedItem.type === item.type && selectedItem.id === item.id

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
            return (
              <li
                key={c.id}
                onClick={() => onSelect({ type: 'channel', id: c.id })}
                className={`h-8 px-3 rounded text-sm flex items-center gap-2 cursor-pointer ${
                  selected ? 'bg-[#1264A3] text-white' : 'hover:bg-white/10'
                }`}
              >
                <span className="text-white/70">#</span>
                <span>{c.name}</span>
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
  selectedItem,
  onMenuClick,
}: {
  selectedItem: SelectedItem
  onMenuClick: () => void
}) {
  const label =
    selectedItem.type === 'channel'
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

export default function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SelectedItem>({
    type: 'channel',
    id: channels[0].id,
  })
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  const visibleMessages = messages.filter(
    (m) => m.type === selectedItem.type && m.parentId === selectedItem.id
  )

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
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
      <Sidebar selectedItem={selectedItem} onSelect={setSelectedItem} />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="left"
          className="w-[260px] bg-[#611f69] text-white p-0"
        >
          <SidebarContent
            selectedItem={selectedItem}
            onSelect={setSelectedItem}
          />
        </SheetContent>
      </Sheet>
      <main className="flex-1 flex flex-col">
        <ChannelHeader
          selectedItem={selectedItem}
          onMenuClick={() => setIsOpen(true)}
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
