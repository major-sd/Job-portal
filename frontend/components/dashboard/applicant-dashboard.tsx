"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BriefcaseIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"

export default function ApplicantDashboard() {
  interface Application {
    id: string;
    job: {
      id: string;
      title: string;
      company: { name: string };
    };
    status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED";
    appliedAt: string;
  }

  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // In a real implementation, this would fetch from the API
        const data = await api.getMyApplications();
        setApplications(data);

        // Mock data for demonstration
        // setApplications([
        //   {
        //     id: "1",
        //     job: {
        //       id: "1",
        //       title: "Senior Frontend Developer",
        //       company: { name: "TechCorp Inc." },
        //     },
        //     status: "PENDING",
        //     appliedAt: "2023-05-10T00:00:00Z",
        //   },
        //   {
        //     id: "2",
        //     job: {
        //       id: "3",
        //       title: "UX/UI Designer",
        //       company: { name: "Creative Solutions" },
        //     },
        //     status: "REVIEWING",
        //     appliedAt: "2023-05-08T00:00:00Z",
        //   },
        //   {
        //     id: "3",
        //       job: {
        //       id: "5",
        //       title: "Product Manager",
        //       company: { name: "InnovateCo" },
        //     },
        //     status: "REJECTED",
        //     appliedAt: "2023-05-05T00:00:00Z",
        //   },
        //   {
        //     id: "4",
        //     job: {
        //       id: "2",
        //       title: "Backend Engineer",
        //       company: { name: "DataSystems Ltd." },
        //     },
        //     status: "ACCEPTED",
        //     appliedAt: "2023-05-03T00:00:00Z",
        //   },
        // ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const getStatusIcon = (status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED") => {
    switch (status) {
      case "PENDING":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case "REVIEWING":
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      case "ACCEPTED":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case "REJECTED":
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5" />
    }
  }

  const getStatusText = (status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED") => {
    switch (status) {
      case "PENDING":
        return "Pending"
      case "REVIEWING":
        return "Under Review"
      case "ACCEPTED":
        return "Accepted"
      case "REJECTED":
        return "Rejected"
      default:
        return status
    }
  }

  return (
    <Tabs defaultValue="applications">
      <TabsList className="mb-4">
        <TabsTrigger value="applications">My Applications</TabsTrigger>
        {/* <TabsTrigger value="saved">Saved Jobs</TabsTrigger> */}
      </TabsList>

      <TabsContent value="applications">
        <Card>
          <CardHeader>
            <CardTitle>Job Applications</CardTitle>
            <CardDescription>Track the status of your job applications</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading your applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8">
                <BriefcaseIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No applications yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You haven't applied to any jobs yet. Start exploring opportunities!
                </p>
                <Link href="/jobs">
                  <Button className="mt-4">Browse Jobs</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application?.id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <h3 className="font-medium">{application?.job?.title}</h3>
                      <p className="text-sm text-muted-foreground">{application?.job?.company.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Applied on {new Date(application?.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0">
                      <div className="flex items-center gap-1 mr-4">
                        {getStatusIcon(application?.status)}
                        <span className="text-sm font-medium">{getStatusText(application?.status)}</span>
                      </div>
                      <Link href={`/jobs/${application?.job?.id}`}>
                        <Button variant="outline" size="sm">
                          View Job
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="saved">
        <Card>
          <CardHeader>
            <CardTitle>Saved Jobs</CardTitle>
            <CardDescription>Jobs you've saved for later</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BriefcaseIcon className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No saved jobs</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You haven't saved any jobs yet. Save jobs to apply to them later.
              </p>
              <Link href="/jobs">
                <Button className="mt-4">Browse Jobs</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
