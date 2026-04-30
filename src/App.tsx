import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { channels, messages, type Message } from '@/data/messages'
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

function MessageList({ items }: { items: Message[] }) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
      {items.map((m) => (
        <div key={m.id} className="flex gap-3">
          <Avatar>
            <AvatarFallback>{getInitials(m.userName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold">{m.userName}</span>
              <span className="text-xs text-muted-foreground">
                {formatTime(m.createdAt)}
              </span>
            </div>
            <p className="text-sm">{m.body}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function MessageInput() {
  return (
    <div className="sticky bottom-0 border-t bg-background px-6 py-3 flex gap-2">
      <Input placeholder="# general へメッセージを送信" className="flex-1" />
      <Button>送信</Button>
    </div>
  )
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SelectedItem>({
    type: 'channel',
    id: channels[0].id,
  })

  const visibleMessages = messages.filter(
    (m) => m.type === selectedItem.type && m.parentId === selectedItem.id
  )

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
        <MessageList items={visibleMessages} />
        <MessageInput />
      </main>
    </div>
  )
}
