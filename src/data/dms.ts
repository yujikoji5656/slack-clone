export type DirectMessage = {
  id: string
  name: string
  online: boolean
}

export const dms: DirectMessage[] = [
  { id: 'tanaka', name: '田中', online: true },
  { id: 'suzuki', name: '鈴木', online: false },
  { id: 'sato', name: '佐藤', online: true },
]
