"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { SearchIcon } from "lucide-react"
import JobList from "@/components/job-list"
import { LocationCombobox } from "@/components/location-combobox"
import { useState } from "react"

export default function JobsPage() {
  const [location, setLocation] = useState("")

  return (
    <div className="container px-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Jobs</h1>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-medium">Filter Jobs</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Keywords</label>
                  <Input placeholder="Job title or keywords" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <LocationCombobox 
                    value={location} 
                    onChange={setLocation} 
                    placeholder="Any location"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Salary Range</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any salary" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-50k">$0 - $50k</SelectItem>
                      <SelectItem value="50k-100k">$50k - $100k</SelectItem>
                      <SelectItem value="100k-150k">$100k - $150k</SelectItem>
                      <SelectItem value="150k+">$150k+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <JobList />
        </div>
      </div>
    </div>
  )
}
