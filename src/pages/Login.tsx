import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setSubmitting(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('ログインしました')
    navigate('/')
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setSubmitting(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('ログインしました')
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ようこそ</CardTitle>
          <CardDescription>
            アカウント作成またはログインしてください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">ログイン</TabsTrigger>
              <TabsTrigger value="signup">サインアップ</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form className="flex flex-col gap-4 mt-4" onSubmit={handleSignIn}>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="signin-email">メールアドレス</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="signin-password">パスワード</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    autoComplete="current-password"
                    minLength={6}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={submitting}>
                  ログイン
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form className="flex flex-col gap-4 mt-4" onSubmit={handleSignUp}>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="signup-email">メールアドレス</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="signup-password">パスワード（6文字以上）</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={submitting}>
                  サインアップ
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
