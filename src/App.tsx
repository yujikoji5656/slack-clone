import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { channels, messages } from '@/data/messages'

function SidebarContent() {
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
          {channels.map((c) => (
            <li
              key={c.id}
              className="h-8 px-3 rounded text-sm flex items-center gap-2 hover:bg-white/10 cursor-pointer"
            >
              <span className="text-white/70">#</span>
              <span>{c.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="hidden md:flex w-[260px] flex-shrink-0 bg-[#611f69] text-white flex-col">
      <SidebarContent />
    </aside>
  )
}

function ChannelHeader({ onMenuClick }: { onMenuClick: () => void }) {
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
      <h2 className="text-xl font-bold"># general</h2>
    </header>
  )
}

function MessageList() {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
      {messages.map((m) => (
        <div key={m.id} className="flex gap-3">
          <Avatar>
            <AvatarFallback>{m.initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold">{m.user}</span>
              <span className="text-xs text-muted-foreground">{m.time}</span>
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

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="left"
          className="w-[260px] bg-[#611f69] text-white p-0"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>
      <main className="flex-1 flex flex-col">
        <ChannelHeader onMenuClick={() => setIsOpen(true)} />
        <MessageList />
        <MessageInput />
      </main>
    </div>
  )
}
