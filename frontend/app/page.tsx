"use client"  // Adding use client directive since we're using React hooks

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { SearchIcon } from "lucide-react"
import Link from "next/link"
import JobList from "@/components/job-list"
import { LocationCombobox } from "@/components/location-combobox"
import { useState } from "react"

export default function Home() {
  const [location, setLocation] = useState("")

  return (
    <div className="flex flex-col gap-8">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Find Your Dream Job Today
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Browse thousands of job listings and find the perfect match for your skills and experience.
              </p>
            </div>
            <div className="w-full max-w-3xl space-y-2">
              <form className="flex flex-col gap-2 md:flex-row">
                <div className="flex-1">
                  <Input placeholder="Job title or keywords" />
                </div>
                <div className="flex-1">
                  <LocationCombobox 
                    value={location} 
                    onChange={setLocation} 
                    placeholder="Location"
                  />
                </div>
                <div className="flex-1">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Salary Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-50k">$0 - $50k</SelectItem>
                      <SelectItem value="50k-100k">$50k - $100k</SelectItem>
                      <SelectItem value="100k-150k">$100k - $150k</SelectItem>
                      <SelectItem value="150k+">$150k+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 md:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Featured Jobs</h2>
          <Link href="/jobs">
            <Button variant="outline">View All Jobs</Button>
          </Link>
        </div>
        <JobList limit={5} />
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">For Job Seekers</h3>
                  <p className="text-muted-foreground">
                    Create a profile, upload your resume, and start applying to jobs that match your skills and
                    experience.
                  </p>
                  <Link href="/auth/register?role=APPLICANT">
                    <Button className="mt-4">Sign Up as Applicant</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">For Employers</h3>
                  <p className="text-muted-foreground">
                    Post job openings, review applications, and find the perfect candidates for your company.
                  </p>
                  <Link href="/auth/register?role=COMPANY">
                    <Button className="mt-4">Sign Up as Company</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Why Choose Us</h3>
                  <p className="text-muted-foreground">
                    Our platform connects talented professionals with top companies, making the job search process
                    simple and efficient.
                  </p>
                  <Link href="/about">
                    <Button variant="outline" className="mt-4">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
