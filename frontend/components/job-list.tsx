"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPinIcon, CalendarIcon, DollarSignIcon } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"

export default function JobList({ limit, filterParams }: { limit?: number; filterParams?: any }) {
  interface Job {
    id: string
    title: string
    company: { name: string }
    location: string
    salaryRange: string
    description: string
    postedAt: string
  }

  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log("Fetching jobs with filter params:", filterParams);
        if (filterParams) {
          const data = await api.getJobs(filterParams)
          setJobs(data)
        }
        else{
          const data = await api.getJobs()
          setJobs(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [filterParams])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <div className="flex flex-wrap gap-2 pt-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Error loading jobs: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {(limit ? jobs.slice(0, limit) : jobs).map((job) => (
        <Card key={job?.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-3">
              <h3 className="text-xl font-bold">{job?.title}</h3>
              <p className="text-muted-foreground">{job?.company?.name}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <MapPinIcon className="mr-1 h-4 w-4" />
                  {job?.location}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <DollarSignIcon className="mr-1 h-4 w-4" />
                  {job?.salaryRange}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  Posted {new Date(job?.postedAt).toLocaleDateString()}
                </div>
              </div>
              <p className="line-clamp-2">{job?.description}</p>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 p-6 flex justify-between items-center">
            <div>
              <Badge variant="outline">Full-time</Badge>
            </div>
            <Link href={`/jobs/${job?.id}`}>
              <Button>View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
