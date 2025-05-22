"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { SearchIcon, XIcon ,RefreshCw } from "lucide-react"
import JobList from "@/components/job-list"
import { LocationCombobox } from "@/components/location-combobox"
import { useState } from "react"
import { api } from "@/lib/api"

export default function JobsPage() {
  const [location, setLocation] = useState("")
  const [title, setTitle] = useState("")
  const [salaryRange, setSalaryRange] = useState("")
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterParams, setFilterParams] = useState(null)
  
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setLoading(true)
    try {
      const params: any = {}
      if (title) params.title = title
      if (location) params.location = location
      if (salaryRange) params.salaryRange = salaryRange
      console.log("Filter params:", params);
      setFilterParams(params)
      const data = await api.getJobs(params)
      setJobs(data)
    } catch (err) {
      // Optionally show a toast or error
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    setFilterParams(null)
  // Optionally re-fetch data or reset filterParams here
};
  return (
    <div className="container px-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Jobs</h1>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
        <form onSubmit={handleSubmit}>
                    <Card>
            <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Filter Jobs</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleRefresh}
                      className="text-muted-foreground hover:text-red-500"
                      aria-label="Clear Filters"
                    >
                      <RefreshCw  className="h-4 w-4" />
                    </Button>
                  </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Keywords</label>
                   <Input placeholder="Job title or keywords" value={title} onChange={e => setTitle(e.target.value)} />
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
                  <Select value={salaryRange} onValueChange={setSalaryRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Salary Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$0 - $25K">$0 - $25K</SelectItem>
                      <SelectItem value="$25K - $50K">$25K - $50K</SelectItem>
                      <SelectItem value="$50K - $75K">$50K - $75K</SelectItem>
                      <SelectItem value="$75K - $100K">$75K - $100K</SelectItem>
                      <SelectItem value="$100K - $150K">$100K - $150K</SelectItem>
                      <SelectItem value="$150K - Above">$150K - Above</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" disabled={loading}>
                  <SearchIcon className="mr-2 h-4 w-4" />
                    {loading ? "Searching..." : "Apply Filters"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
        </div>

        <div>
          <JobList  filterParams={filterParams} limit={500}/>
        </div>
      </div>
    </div>
  )
}
