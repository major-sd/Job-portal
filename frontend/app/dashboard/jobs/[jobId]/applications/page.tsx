"use client"

import { useState, useEffect, use } from "react"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"




type Application = {
  id: number
  job: {
    id: number
    title: string
    description: string
    company: {
      id: number
      name: string
      email: string
      password: string
      role: string
      createdAt: string
      active: boolean
      companyProfile: null
    }
    location: string
    salaryRange: string
    postedAt: string
    requirements: string[]
    responsibilities: string[]
    active: boolean
  }
  applicant: {
    id: number
    name: string
    email: string
    password: string
    role: string
    createdAt: string
    active: boolean
    companyProfile: null
  }
  resumeUrl: string
  status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED"
  appliedAt: string
}

// This would normally fetch data from an API
async function getApplicationsForJob(jobId: string): Promise<Application[]> {
  // Simulate API call delay
  const data= await api.getApplicantsForAJob(parseInt(jobId,10))
  return data;
  // Mock data as provided
  // return [
  //   {
  //     id: 13,
  //     job: {
  //       id: 19,
  //       title: "dev1",
  //       description: "jd1",
  //       company: {
  //         id: 26,
  //         name: "Amazon",
  //         email: "amazon@example.com",
  //         password: "$2a$10$XQTSWo/BJydDcwK113f1RuJo.D4Xdq0BdV6XUouCaZQ127HItFfjm",
  //         role: "COMPANY",
  //         createdAt: "2025-05-18T18:58:01.121676",
  //         active: true,
  //         companyProfile: null,
  //       },
  //       location: "San Francisco",
  //       salaryRange: "$25K - $50K",
  //       postedAt: "2025-05-19T23:14:44.599964",
  //       requirements: ["r1", "r2"],
  //       responsibilities: ["m1", "m2"],
  //       active: true,
  //     },
  //     applicant: {
  //       id: 32,
  //       name: "Mak",
  //       email: "mak@example.com",
  //       password: "$2a$10$/UV1OLhkVdBo3TuobrqaaO.TALEISkSLlvvuYb2msJ4EM5JPrYBV.",
  //       role: "APPLICANT",
  //       createdAt: "2025-05-19T23:32:29.260078",
  //       active: true,
  //       companyProfile: null,
  //     },
  //     resumeUrl: "/api/applicant/resume/32/2bdc59ae-146b-43b3-91ba-5136369eab11.pdf",
  //     status: "PENDING",
  //     appliedAt: "2025-05-19T23:33:35.432709",
  //   },
  //   {
  //     id: 19,
  //     job: {
  //       id: 19,
  //       title: "dev1",
  //       description: "jd1",
  //       company: {
  //         id: 26,
  //         name: "Amazon",
  //         email: "amazon@example.com",
  //         password: "$2a$10$XQTSWo/BJydDcwK113f1RuJo.D4Xdq0BdV6XUouCaZQ127HItFfjm",
  //         role: "COMPANY",
  //         createdAt: "2025-05-18T18:58:01.121676",
  //         active: true,
  //         companyProfile: null,
  //       },
  //       location: "San Francisco",
  //       salaryRange: "$25K - $50K",
  //       postedAt: "2025-05-19T23:14:44.599964",
  //       requirements: ["r1", "r2"],
  //       responsibilities: ["m1", "m2"],
  //       active: true,
  //     },
  //     applicant: {
  //       id: 25,
  //       name: "sample1",
  //       email: "sample1@example.com",
  //       password: "$2a$10$Zx1dCA1XAT6dkzg4QbWS9eiWlgsbRRY4ZTSOb8PAmgKUfG5NUvgyy",
  //       role: "APPLICANT",
  //       createdAt: "2025-05-18T14:22:09.529112",
  //       active: true,
  //       companyProfile: null,
  //     },
  //     resumeUrl: "/api/applicant/resume/25/5b8c337b-123d-447f-b4f8-8a4ff7158107.pdf",
  //     status: "PENDING",
  //     appliedAt: "2025-05-20T02:28:00.500463",
  //   },
  //   {
  //     id: 20,
  //     job: {
  //       id: 19,
  //       title: "dev1",
  //       description: "jd1",
  //       company: {
  //         id: 26,
  //         name: "Amazon",
  //         email: "amazon@example.com",
  //         password: "$2a$10$XQTSWo/BJydDcwK113f1RuJo.D4Xdq0BdV6XUouCaZQ127HItFfjm",
  //         role: "COMPANY",
  //         createdAt: "2025-05-18T18:58:01.121676",
  //         active: true,
  //         companyProfile: null,
  //       },
  //       location: "San Francisco",
  //       salaryRange: "$25K - $50K",
  //       postedAt: "2025-05-19T23:14:44.599964",
  //       requirements: ["r1", "r2"],
  //       responsibilities: ["m1", "m2"],
  //       active: true,
  //     },
  //     applicant: {
  //       id: 20,
  //       name: "Abhi",
  //       email: "abhi@example.com",
  //       password: "$2a$10$9ew16lgUhBDC4ETkoy22hef56nADYJGZHpOhijgFbHk3YQQmRZQf.",
  //       role: "APPLICANT",
  //       createdAt: "2025-05-18T14:01:56.927525",
  //       active: true,
  //       companyProfile: null,
  //     },
  //     resumeUrl: "/api/applicant/resume/20/d054b6aa-9dff-4678-a29b-4b93eea16d51.pdf",
  //     status: "PENDING",
  //     appliedAt: "2025-05-20T02:29:17.866792",
  //   },
  //   {
  //     id: 21,
  //     job: {
  //       id: 19,
  //       title: "dev1",
  //       description: "jd1",
  //       company: {
  //         id: 26,
  //         name: "Amazon",
  //         email: "amazon@example.com",
  //         password: "$2a$10$XQTSWo/BJydDcwK113f1RuJo.D4Xdq0BdV6XUouCaZQ127HItFfjm",
  //         role: "COMPANY",
  //         createdAt: "2025-05-18T18:58:01.121676",
  //         active: true,
  //         companyProfile: null,
  //       },
  //       location: "San Francisco",
  //       salaryRange: "$25K - $50K",
  //       postedAt: "2025-05-19T23:14:44.599964",
  //       requirements: ["r1", "r2"],
  //       responsibilities: ["m1", "m2"],
  //       active: true,
  //     },
  //     applicant: {
  //       id: 3,
  //       name: "applicant1",
  //       email: "applicant1@example.com",
  //       password: "$2a$10$ufzUrd/QGVx2DMQsIAutJu4tBLgRv..hgPOOLWjVTjTIAPARSEOii",
  //       role: "APPLICANT",
  //       createdAt: "2025-05-17T07:48:05.263226",
  //       active: true,
  //       companyProfile: null,
  //     },
  //     resumeUrl: "/api/applicant/resume/3/5ea6501a-dbad-41fc-9515-47caa63d8591.pdf",
  //     status: "PENDING",
  //     appliedAt: "2025-05-20T02:30:12.157098",
  //   },
  // ]
}

function ApplicationCard({
  application,
  onStatusChange,
}: {
  application: Application
  onStatusChange: (id: number, status: Application["status"]) => void
}) {

  const { toast } = useToast()
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
    const URL=`http://localhost:3000/uploads/resumes/${application.resumeUrl.split("/")[4]}/${application.resumeUrl.split("/")[5]}`
    window.open(URL, "_blank")
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
                <Button variant="outline" className={getStatusColor(application.status)}>
                  {application.status}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onStatusChange(application.id, "PENDING")}>
                  <Badge variant="outline" className={getStatusColor("PENDING")}>
                    PENDING
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(application.id, "REVIEWING")}>
                  <Badge variant="outline" className={getStatusColor("REVIEWING")}>
                    REVIEWING
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(application.id, "ACCEPTED")}>
                  <Badge variant="outline" className={getStatusColor("ACCEPTED")}>
                    ACCEPTED
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(application.id, "REJECTED")}>
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

function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-10 px-5">
      <div className="mb-8">
        <Skeleton className="h-10 w-2/3 mb-2" />
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-28" />
        </div>
      </div>

      <div className="mb-4">
        <Skeleton className="h-8 w-48 mb-2" />
      </div>

      <div className="grid gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function JobApplicationsPage({ params }: { params: { jobId: string } }) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)
        if(params?.jobId){
          const data = await getApplicationsForJob(params.jobId)
          setApplications(data)
          setError(null)
        }
        
       
        
      } catch (err) {
        console.error("Error fetching applications:", err)
        setError("Failed to load applications. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [params?.jobId])

  const handleStatusChange = async (applicationId: number, newStatus: Application["status"]) => {
    // In a real app, you would make an API call here
    // await updateApplicationStatus(applicationId, newStatus);
    console.log("changed")
    setApplications((prevApplications) =>
      prevApplications.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app)),
    )
    try{
      await api.updateApplicationStatus(applicationId,newStatus)
    }catch(err){
      console.log("inside error",err?.message)   
      toast({
        title: "Some Error has occured",
        description: "Some Error has occured",
        variant: "destructive",
      })
    }
     
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-5">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className="container mx-auto py-10 px-5">
        <h1 className="text-2xl font-bold mb-6">No applications found....</h1>
      </div>
    )
  }

  // Get job details from the first application
  const jobDetails = applications[0]?.job

  return (
    <div className="container mx-auto py-10 px-5">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{jobDetails.title} - Applications</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium">{jobDetails.company.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{jobDetails.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{jobDetails.salaryRange}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">
          {applications.length} Application{applications.length !== 1 ? "s" : ""}
        </h2>
      </div>

      <div className="grid gap-6">
        {applications.map((application) => (
          <ApplicationCard key={application.id} application={application} onStatusChange={handleStatusChange} />
        ))}
      </div>
    </div>
  )
}
