'use client'
import * as React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Settings, User, Bell, Camera, Loader2, Check } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { useUiStore } from '@/store/uiStore'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { useQueryClient } from '@tanstack/react-query'

export default function SettingsPage() {
  const { user, profile } = useUser()
  const { addToast } = useUiStore()
  const queryClient = useQueryClient()
  const supabase = createClient()

  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)

  // Display name state
  const [displayName, setDisplayName] = React.useState('')
  const [isSavingName, setIsSavingName] = React.useState(false)

  // Sync display name from profile once loaded
  React.useEffect(() => {
    if (profile?.display_name) setDisplayName(profile.display_name)
  }, [profile?.display_name])

  const handleSaveDisplayName = async () => {
    if (!user || !displayName.trim()) return
    setIsSavingName(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName.trim() })
        .eq('id', user.id)
      if (error) throw error
      queryClient.invalidateQueries({ queryKey: ['profile', user.id] })
      addToast({ type: 'success', message: 'Display name updated!' })
    } catch (err) {
      console.error(err)
      addToast({ type: 'error', message: 'Failed to update display name.' })
    } finally {
      setIsSavingName(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const cancelUpload = () => {
    setPreviewUrl(null)
    setSelectedFile(null)
  }

  const handleSaveAvatar = async () => {
    if (!user || !selectedFile) return
    setIsUploading(true)
    
    try {
      const fileExt = selectedFile.name.split('.').pop()
      const filePath = `${user.id}/${Math.random()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, selectedFile, { upsert: true })
        
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      queryClient.invalidateQueries({ queryKey: ['profile', user.id] })
      setSelectedFile(null)
      addToast({ type: 'success', message: 'Profile picture updated successfully' })
    } catch (err) {
      console.error('Error uploading avatar:', err)
      addToast({ type: 'error', message: 'Failed to update profile picture' })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card className="bg-white/40 dark:bg-black/20 backdrop-blur-md border border-black/5 dark:border-white/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <User className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your account identity.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-6 pb-4 border-b border-black/5 dark:border-white/5">
                <div className="relative group">
                  <Avatar 
                    src={previewUrl || profile?.avatar_url} 
                    fallback={profile?.display_name || user?.email} 
                    className="h-24 w-24 border-2 border-black/10 dark:border-white/10"
                  />
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                    <Camera className="h-6 w-6 mb-1" />
                    <span className="text-[10px] font-medium uppercase tracking-wider">Change</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isUploading} />
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Profile Picture</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">PNG, JPG or GIF. Max 5MB.</p>
                  
                  {previewUrl && selectedFile ? (
                    <div className="flex gap-2">
                      <button 
                        onClick={handleSaveAvatar} 
                        disabled={isUploading}
                        className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700 h-9 px-4 py-2 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isUploading ? 'Saving...' : 'Save Avatar'}
                      </button>
                      <button 
                        onClick={cancelUpload} 
                        disabled={isUploading}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/20 h-9 px-4 py-2 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <label className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/20 h-9 px-4 py-2 cursor-pointer">
                      Upload New
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Display Name</label>
                <div className="flex items-center gap-2 max-w-md">
                  <input 
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveDisplayName()}
                    placeholder="Your display name"
                    className="block w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  />
                  <button
                    onClick={handleSaveDisplayName}
                    disabled={isSavingName || !displayName.trim() || displayName.trim() === profile?.display_name}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl text-sm font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 disabled:opacity-40 disabled:pointer-events-none shrink-0"
                  >
                    {isSavingName ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {isSavingName ? 'Saving' : 'Save'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <input 
                  type="email" 
                  disabled
                  value={user?.email || ''} 
                  className="block w-full max-w-md rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-2.5 text-gray-900 dark:text-white opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="bg-white/40 dark:bg-black/20 backdrop-blur-md border border-black/5 dark:border-white/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Settings className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Customize how The Queue looks.</p>
              </div>
            </div>
            <div className="flex items-center justify-between max-w-md rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 p-4">
              <div>
                <span className="block font-medium text-gray-900 dark:text-white">Theme Preference</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Toggle dark mode</span>
              </div>
              <div className="bg-white/50 dark:bg-black/50 p-2 rounded-full border border-black/5 dark:border-white/5">
                <ThemeToggle />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Settings */}
        <Card className="bg-white/40 dark:bg-black/20 backdrop-blur-md border border-black/5 dark:border-white/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                <Bell className="h-5 w-5 text-pink-500 dark:text-pink-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Choose what you want to be notified about.</p>
              </div>
            </div>
            <div className="rounded-xl border border-dashed border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-8 text-center">
              <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2 opacity-50" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">Notification preferences coming soon</p>
              <p className="text-sm text-gray-500 mt-1">We're working on giving you fine-grained control over your alerts.</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
