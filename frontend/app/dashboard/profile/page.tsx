"use client"

import Link from "next/link"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, isLoading, updateUserProfile } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [resumeUrl, setResumeUrl] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
      return
    }

    if (user) {
      setName(user.name)
      setEmail(user.email)
      // These would come from the actual profile data in a real implementation
      setBio(user.bio || "")
      setResumeUrl(user.resumeUrl || "")
    }
  }, [user, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      await updateUserProfile({ name, bio, resumeUrl })
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real implementation, this would upload the file to a storage service
      // and then set the URL
      setResumeUrl(`/uploads/${file.name}`)
      toast({
        title: "Resume uploaded",
        description: "Your resume has been uploaded successfully.",
      })
    }
  }

  if (isLoading || !user) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <nav className="flex flex-col space-y-1">
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/dashboard/profile">Profile Information</Link>
                </Button>
                {user.role === "APPLICANT" && (
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/dashboard/applications">My Applications</Link>
                  </Button>
                )}
                {user.role === "COMPANY" && (
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/dashboard/jobs">My Job Postings</Link>
                  </Button>
                )}
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/dashboard/security">Security</Link>
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} disabled />
                <p className="text-sm text-muted-foreground">
                  Email cannot be changed. Contact support for assistance.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                />
              </div>
              {user.role === "APPLICANT" && (
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume</Label>
                  <div className="flex items-center gap-2">
                    <Input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                  </div>
                  {resumeUrl && (
                    <p className="text-sm text-muted-foreground">Current resume: {resumeUrl.split("/").pop()}</p>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
