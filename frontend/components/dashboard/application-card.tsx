"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { Application } from "@/components/applications-list"

export function ApplicationCard({ application }: { application: Application }) {
  const [status, setStatus] = useState<Application["status"]>(application.status)

  const handleStatusChange = async (newStatus: Application["status"]) => {
    // In a real app, you would make an API call here
    // await updateApplicationStatus(application.id, newStatus);
    setStatus(newStatus)
  }

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80"
      case "REVIEWING":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80"
      case "ACCEPTED":
        return "bg-green-100 text-green-800 hover:bg-green-100/80"
      case "REJECTED":
        return "bg-red-100 text-red-800 hover:bg-red-100/80"
      default:
        return ""
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return dateString
    }
  }

  const openResume = () => {
    application.resumeUrl="http://localhost:3000/uploads/resumes/32/b4e22bd0-cc9d-4188-83e3-ae6de46567c3.pdf"
    window.open(application.resumeUrl, "_blank")
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">{application.applicant.name}</h3>
            <p className="text-sm text-muted-foreground">{application.applicant.email}</p>
            <p className="text-sm text-muted-foreground">Applied {formatDate(application.appliedAt)}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={getStatusColor(status)}>
                  {status}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange("PENDING")}>
                  <Badge variant="outline" className={getStatusColor("PENDING")}>
                    PENDING
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("REVIEWING")}>
                  <Badge variant="outline" className={getStatusColor("REVIEWING")}>
                    REVIEWING
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("ACCEPTED")}>
                  <Badge variant="outline" className={getStatusColor("ACCEPTED")}>
                    ACCEPTED
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("REJECTED")}>
                  <Badge variant="outline" className={getStatusColor("REJECTED")}>
                    REJECTED
                  </Badge>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={openResume} variant="outline" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              View Resume
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
