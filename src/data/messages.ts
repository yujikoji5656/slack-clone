export type Channel = {
  id: string
  name: string
}

export type Message = {
  id: string
  user: string
  initials: string
  time: string
  body: string
}

export const channels: Channel[] = [
  { id: 'general', name: 'general' },
  { id: 'random', name: 'random' },
  { id: 'project-a', name: 'project-a' },
  { id: 'design', name: 'design' },
  { id: 'announcements', name: 'announcements' },
]

export const messages: Message[] = [
  {
    id: 'm1',
    user: 'Alice Johnson',
    initials: 'AJ',
    time: '09:12',
    body: 'おはようございます！今日もよろしくお願いします。',
  },
  {
    id: 'm2',
    user: 'Bob Smith',
    initials: 'BS',
    time: '09:15',
    body: 'おはようー。昨日のリリース無事に出ましたね。',
  },
  {
    id: 'm3',
    user: 'Carol Tanaka',
    initials: 'CT',
    time: '09:21',
    body: 'デザインレビュー、10時からで大丈夫ですか？',
  },
  {
    id: 'm4',
    user: 'Daniel Park',
    initials: 'DP',
    time: '09:24',
    body: '@here APIの仕様書を更新しました。確認お願いします。',
  },
  {
    id: 'm5',
    user: 'Emi Watanabe',
    initials: 'EW',
    time: '09:30',
    body: 'コーヒー淹れたので、休憩室にどうぞ ☕',
  },
  {
    id: 'm6',
    user: 'Frank Miller',
    initials: 'FM',
    time: '09:42',
    body: 'PR #128 レビュー依頼です。サイズ小さめなのですぐ見れると思います。',
  },
  {
    id: 'm7',
    user: 'Grace Lee',
    initials: 'GL',
    time: '09:55',
    body: 'ミーティングルームB、12時まで予約しておきました。',
  },
  {
    id: 'm8',
    user: 'Hiro Sato',
    initials: 'HS',
    time: '10:03',
    body: '本番のログにエラー出てます。調査開始します。',
  },
  {
    id: 'm9',
    user: 'Ivy Chen',
    initials: 'IC',
    time: '10:18',
    body: 'リリースノートのドラフト共有しました 🙌',
  },
  {
    id: 'm10',
    user: 'Jun Nakamura',
    initials: 'JN',
    time: '10:25',
    body: 'ランチ、新しくできたラーメン屋どうですか？',
  },
]
