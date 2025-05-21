"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPinIcon, CalendarIcon, DollarSignIcon } from "lucide-react"
import Link from "next/link"
import ApplyJobButton from "@/components/apply-job-button"
import { use, useEffect, useState } from "react"
import { api } from "@/lib/api"

interface JobDetailsPageProps {
  params: {
    id: string
  }
}

export default function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id: jobId } = use(params)
  const [job, setJob] = useState(null)
  const fetchJobDetails = async () => {
    const data = await api.getJobById(jobId)
    if (!data) {
      throw new Error("Job not found")
    }
    setJob(data);
  };

  useEffect(() => {
    fetchJobDetails().catch(error => {
      console.error(error);

    });
  }, [jobId]);

  if (!job) return <div>Loading...</div>;
  if (!job.company) return <div>Company not found</div>;
  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline">{job.company.name}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPinIcon className="mr-1 h-4 w-4" />
                {job.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSignIcon className="mr-1 h-4 w-4" />
                {job.salaryRange}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="mr-1 h-4 w-4" />
                Posted {new Date(job.postedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{job.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {job.responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Apply for this job</CardTitle>
              <CardDescription>Submit your application to {job.company.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <ApplyJobButton jobId={jobId} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About {job.company.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                TechCorp Inc. is a leading technology company specializing in innovative software solutions for
                businesses of all sizes.
              </p>
              <Separator className="my-4" />
              <Link href={`/companies/${job.company?.id}`}>
                <Button variant="outline" className="w-full">
                  View Company Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
