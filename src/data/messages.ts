export type Channel = {
  id: string
  name: string
}

export type Message = {
  id: string
  type: 'channel' | 'dm'
  parentId: string
  userName: string
  body: string
  createdAt: string
}

export const channels: Channel[] = [
  { id: 'general', name: 'general' },
  { id: 'random', name: 'random' },
  { id: 'project-a', name: 'project-a' },
  { id: 'design', name: 'design' },
  { id: 'announcements', name: 'announcements' },
]

export const messages: Message[] = [
  // # general (4)
  { id: 'g1', type: 'channel', parentId: 'general', userName: 'Alice Johnson', body: 'おはようございます！今日もよろしくお願いします。', createdAt: '2026-04-30T09:12:00' },
  { id: 'g2', type: 'channel', parentId: 'general', userName: 'Bob Smith', body: 'おはようー。昨日のリリース無事に出ましたね。', createdAt: '2026-04-30T09:15:00' },
  { id: 'g3', type: 'channel', parentId: 'general', userName: 'Carol Tanaka', body: 'デザインレビュー、10時からで大丈夫ですか？', createdAt: '2026-04-30T09:21:00' },
  { id: 'g4', type: 'channel', parentId: 'general', userName: 'Daniel Park', body: '@here APIの仕様書を更新しました。確認お願いします。', createdAt: '2026-04-30T09:24:00' },

  // # random (3)
  { id: 'r1', type: 'channel', parentId: 'random', userName: 'Emi Watanabe', body: 'コーヒー淹れたので、休憩室にどうぞ ☕', createdAt: '2026-04-30T10:30:00' },
  { id: 'r2', type: 'channel', parentId: 'random', userName: 'Jun Nakamura', body: 'ランチ、新しくできたラーメン屋どうですか？', createdAt: '2026-04-30T11:45:00' },
  { id: 'r3', type: 'channel', parentId: 'random', userName: 'Grace Lee', body: '近所の桜が満開でした 🌸', createdAt: '2026-04-30T12:10:00' },

  // # project-a (5)
  { id: 'p1', type: 'channel', parentId: 'project-a', userName: 'Frank Miller', body: 'PR #128 レビュー依頼です。サイズ小さめなのですぐ見れると思います。', createdAt: '2026-04-30T09:42:00' },
  { id: 'p2', type: 'channel', parentId: 'project-a', userName: 'Hiro Sato', body: '本番のログにエラー出てます。調査開始します。', createdAt: '2026-04-30T10:03:00' },
  { id: 'p3', type: 'channel', parentId: 'project-a', userName: 'Ivy Chen', body: 'リリースノートのドラフト共有しました 🙌', createdAt: '2026-04-30T10:18:00' },
  { id: 'p4', type: 'channel', parentId: 'project-a', userName: 'Daniel Park', body: 'ステージング環境にデプロイ完了しました。', createdAt: '2026-04-30T13:25:00' },
  { id: 'p5', type: 'channel', parentId: 'project-a', userName: 'Frank Miller', body: 'バグ #42 修正完了しました。明日の朝確認お願いします。', createdAt: '2026-04-30T17:40:00' },

  // # design (3)
  { id: 'd1', type: 'channel', parentId: 'design', userName: 'Carol Tanaka', body: '新しいロゴ案、Figma に上げました。意見ください。', createdAt: '2026-04-30T11:00:00' },
  { id: 'd2', type: 'channel', parentId: 'design', userName: 'Grace Lee', body: 'カラーパレット、紫系に統一する方向で進めます。', createdAt: '2026-04-30T14:15:00' },
  { id: 'd3', type: 'channel', parentId: 'design', userName: 'Carol Tanaka', body: 'ヒーロー画像のラフ、3パターン用意できました。', createdAt: '2026-04-30T16:50:00' },

  // # announcements (3)
  { id: 'a1', type: 'channel', parentId: 'announcements', userName: 'Alice Johnson', body: '今週金曜は全社ミーティングです。15時集合でお願いします。', createdAt: '2026-04-30T08:00:00' },
  { id: 'a2', type: 'channel', parentId: 'announcements', userName: 'Bob Smith', body: '新しいセキュリティポリシーを公開しました。各自確認お願いします。', createdAt: '2026-04-30T10:00:00' },
  { id: 'a3', type: 'channel', parentId: 'announcements', userName: 'Alice Johnson', body: 'GW中の障害対応当番表、ピン留めしておきました 📌', createdAt: '2026-04-30T15:30:00' },

  // DM 田中 (4)
  { id: 'tk1', type: 'dm', parentId: 'tanaka', userName: '田中', body: 'お疲れさまです。資料の件、ありがとうございました。', createdAt: '2026-04-30T09:05:00' },
  { id: 'tk2', type: 'dm', parentId: 'tanaka', userName: '自分', body: 'こちらこそ。明日の打ち合わせ、10時で大丈夫ですか？', createdAt: '2026-04-30T09:08:00' },
  { id: 'tk3', type: 'dm', parentId: 'tanaka', userName: '田中', body: '10時で問題ないです。会議室Aで合っていますか？', createdAt: '2026-04-30T09:10:00' },
  { id: 'tk4', type: 'dm', parentId: 'tanaka', userName: '自分', body: 'はい、会議室Aで！よろしくお願いします。', createdAt: '2026-04-30T09:12:00' },

  // DM 鈴木 (3)
  { id: 'sz1', type: 'dm', parentId: 'suzuki', userName: '鈴木', body: 'おはようございます。今日は在宅で作業します。', createdAt: '2026-04-30T08:30:00' },
  { id: 'sz2', type: 'dm', parentId: 'suzuki', userName: '自分', body: '了解です。Slack で連絡できれば大丈夫です。', createdAt: '2026-04-30T08:35:00' },
  { id: 'sz3', type: 'dm', parentId: 'suzuki', userName: '鈴木', body: '昼に少し離席します。15時には戻れる予定です。', createdAt: '2026-04-30T11:50:00' },

  // DM 佐藤 (5)
  { id: 'st1', type: 'dm', parentId: 'sato', userName: '佐藤', body: '先ほどの件、ちょっと相談したいです。', createdAt: '2026-04-30T13:00:00' },
  { id: 'st2', type: 'dm', parentId: 'sato', userName: '自分', body: 'もちろんです。今お時間ありますか？', createdAt: '2026-04-30T13:02:00' },
  { id: 'st3', type: 'dm', parentId: 'sato', userName: '佐藤', body: '15分後に Huddle で大丈夫でしょうか。', createdAt: '2026-04-30T13:03:00' },
  { id: 'st4', type: 'dm', parentId: 'sato', userName: '自分', body: '了解です！それまでに資料サッと見ておきます。', createdAt: '2026-04-30T13:05:00' },
  { id: 'st5', type: 'dm', parentId: 'sato', userName: '佐藤', body: 'ありがとうございます。後ほど。', createdAt: '2026-04-30T13:06:00' },
]
