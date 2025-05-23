"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

interface ApplyJobButtonProps {
  jobId: string
}

export default function ApplyJobButton({ jobId }: ApplyJobButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [resumeUrl, setResumeUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to apply for jobs.",
        variant: "destructive",
      })
      router.push(`/auth/login?redirect=/jobs/${jobId}`)
      return
    }

    if (user.role !== "APPLICANT") {
      toast({
        title: "Not authorized",
        description: "Only job seekers can apply for jobs.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const input = document.getElementById('resume') as HTMLInputElement; // Type assertion for input
      const form = new FormData();
      if (input.files && input.files[0]) {
        const data = await api.uploadResume(input.files[0]) // Use the new uploadResume method
        console.log(data);
        const resumeUrl = data.message; // Set the resumeUrl after upload
        await api.applyForJob(jobId, { resumeUrl })
      } else {
        throw new Error("No file selected");
      }

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
        variant: "success"
      })
      setIsOpen(false)
    } catch (error) {
      toast({
        title: "Application failed",
        description: "You already applied for this job or there was an error submitting your application.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real implementation, this would upload the file to a storage service
      // and then set the URL
      setResumeUrl(`/uploads/${file.name}`)
    }
  }

  const handleClick = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to apply for jobs.",
        variant: "destructive",
      })
      router.push(`/auth/login?redirect=/jobs/${jobId}`)
      return
    }

    if (user.role !== "APPLICANT") {
      toast({
        title: "Not authorized",
        description: "Only job seekers can apply for jobs.",
        variant: "destructive",
      })
      return
    }

    setIsOpen(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button className="w-full" onClick={handleClick}>
        Apply Now
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for this job</DialogTitle>
          <DialogDescription>Upload your resume and submit your application.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleApply}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resume">Resume</Label>
              <Input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} required />
              <p className="text-sm text-muted-foreground">Upload your resume in PDF, DOC, or DOCX format.</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !resumeUrl}>
              {isLoading ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
