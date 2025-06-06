"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BriefcaseIcon, PlusIcon, UsersIcon } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { LocationCombobox } from "../location-combobox"
import { useAuth } from "@/context/auth-context"


export default function CompanyDashboard() {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [location,setLocation]=useState("")
  const [applicants,setApplicants]=useState([])
  const { user } = useAuth()
  const [form, setForm] = useState({
    title: "",
    location: "",
    salaryRange: "",
    description: "",
    responsibilities: "",
    requirements: ""
  });
  const [editJobId, setEditJobId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const companyId=JSON.parse(localStorage.getItem("user")).id
  const onChange = (e:any) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // In a real implementation, this would fetch from the API
        const data = await api.getCompanyJobs();
        setJobs(data);
      } finally {
        setIsLoading(false)
      }
    }
    const fetchApplicants=async ()=>{
      try{
  
        // In a real implementation, this would fetch from the API
        const data = await api.getApplicantsForACompany(companyId);
        setApplicants(data);
      }catch(err){
          console.log(err)
        }
       finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
    fetchApplicants()
  }, [])

  const openEditDialog = (job) => {
    setForm({
      title: job.title || "",
      location: job.location || "",
      salaryRange: job.salaryRange || "",
      description: job.description || "",
      responsibilities: (job.responsibilities || []).join("\n"),
      requirements: (job.requirements || []).join("\n"),
    });
    setLocation(job.location || "");
    setEditJobId(job.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data1: { responsibilities: string[]; requirements: string[]; title: string; location: string; salaryRange: string; description: string }) => {
   
    setIsSubmitting(true)

    console.log("data-------",data1)


    try {
      if (editJobId) {
        await api.updateJob(editJobId, data1);
        toast({
          title: "Job updated",
          description: "Your job has been updated successfully.",
          variant: 'success'
        });
      } else {
        await api.createJob(data1);
        toast({
          title: "Job posted",
          description: "Your job has been posted successfully.",
          variant: 'success'  
        });
      }
      setIsDialogOpen(false);
      setEditJobId(null);
      // Optionally refresh jobs
      const data = await api.getCompanyJobs();
      setJobs(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  const salaryRanges = [
    "$0 - $25K",
    "$25K - $50K",
    "$50K - $75K",
    "$75K - $100K",
    "$100K - $150K",
    "$150K - Above",
  ];

  const toggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    try {
      // In a real implementation, this would call the API
      await api.updateJobActiveStatus(jobId, !currentStatus);

      // Update local state for demonstration
      setJobs(jobs.map((job) => (job.id === jobId ? { ...job, active: !currentStatus } : job)))

      toast({
        title: "Status updated",
        description: `Job has been ${!currentStatus ? "activated" : "deactivated"}.`,
        variant:'success'
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating the job status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const onFormSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert responsibilities/requirements to arrays
    const responsibilitiesArr = form.responsibilities
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const requirementsArr = form.requirements
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    // Call your submit handler
    await handleSubmit({
      ...form,
      location,
      responsibilities: responsibilitiesArr,
      requirements: requirementsArr
    });

    setIsSubmitting(false);
    setIsDialogOpen(false);
  };

  const openNewJobDialog = () => {
    setForm({
      title: "",
      location: "",
      salaryRange: "",
      description: "",
      responsibilities: "",
      requirements: "",
    });
    setLocation("");
    setEditJobId(null);
    setIsDialogOpen(true);
  };

  // Sort jobs by postedAt
  const sortedJobs = [...jobs].sort((a, b) => {
    const dateA = new Date(a.postedAt).getTime();
    const dateB = new Date(b.postedAt).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return (
    <Tabs defaultValue="jobs">
      <TabsList className="mb-4">
        <TabsTrigger value="jobs">{companyId ? `${user.name || "Company"} Job Postings` : "My Job Postings"}</TabsTrigger>
        {/* {!companyId && <TabsTrigger value="applications">Applications</TabsTrigger>} */}
      </TabsList>

      <TabsContent value="jobs">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Job Postings</h2>
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              Sort by Date: {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNewJobDialog}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Post New Job
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editJobId ? "Edit Job" : "Post a New Job"}</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to {editJobId ? "edit this job posting" : "create a new job posting"}.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={onFormSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        value={form.title}
                        onChange={onChange}
                        placeholder="e.g. Senior Frontend Developer"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="max-h-40 overflow-y-auto">
                        <LocationCombobox 
                          value={location} 
                          onChange={setLocation} 
                          placeholder="Location"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salaryRange">Salary Range</Label>
                      <select
                        id="salaryRange"
                        value={form.salaryRange}
                        onChange={onChange}
                        required
                        className="w-full border rounded px-2 py-2"
                      >
                        <option value="">Select salary range</option>
                        {salaryRanges.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Job Description</Label>
                      <Textarea
                        id="description"
                        value={form.description}
                        onChange={onChange}
                        placeholder="Describe the job role, responsibilities, and requirements"
                        rows={5}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsibilities">Responsibilities</Label>
                      <Textarea
                        id="responsibilities"
                        value={form.responsibilities}
                        onChange={onChange}
                        placeholder="Enter one responsibility per line"
                        rows={4}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="requirements">Requirements</Label>
                      <Textarea
                        id="requirements"
                        value={form.requirements}
                        onChange={onChange}
                        placeholder="Enter one requirement per line"
                        rows={4}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => { setIsDialogOpen(false); setEditJobId(null); }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (editJobId ? "Saving..." : "Posting...") : (editJobId ? "Save Changes" : "Post Job")}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading your job postings...</p>
              </CardContent>
            </Card>
          ) : sortedJobs.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <BriefcaseIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No job postings yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You haven't posted any jobs yet. Click the button above to create your first job posting.
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedJobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{job.title}</CardTitle>
                      <CardDescription>{job.location}</CardDescription>
                    </div>
                    <Badge variant={job.active ? "default" : "outline"}>{job.active ? "Active" : "Inactive"}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <UsersIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{job.applicationsCount} applications</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Salary Range:</span> {job.salaryRange}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Posted:</span>{" "}
                      {new Date(job.postedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant={job.active ? "outline" : "default"}
                    size="sm"
                    onClick={() => toggleJobStatus(job.id, job.active)}
                  >
                    {job.active ? "Deactivate" : "Activate"}
                  </Button>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/jobs/${job.id}/applications`}>
                      <Button variant="outline" size="sm">
                        View Applications
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(job)}>
                      Edit
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="applications">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>View and manage applications across all your job postings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock data for demonstration */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium">John Doe</h3>
                  <p className="text-sm">Applied for: Senior Frontend Developer</p>
                  <p className="text-xs text-muted-foreground">Applied on May 10, 2023</p>
                </div>
                <div className="flex items-center mt-2 md:mt-0">
                  <Badge className="mr-2">Pending</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        "http://localhost:3000/uploads/resumes/32/b4e22bd0-cc9d-4188-83e3-ae6de46567c3.pdf",
                        "_blank"
                      )
                    }
                  
                  >
                    View Details1
                  </Button>
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium">Jane Smith</h3>
                  <p className="text-sm">Applied for: Backend Engineer</p>
                  <p className="text-xs text-muted-foreground">Applied on May 8, 2023</p>
                </div>
                <div className="flex items-center mt-2 md:mt-0">
                  <Badge className="mr-2" variant="outline">
                    Reviewing
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        "file:///Users/I528949/uploads/resumes/32/b22b64c0-a433-4204-8a74-d6be5747551a.pdf",
                        "_blank"
                      )
                    }
                  >
                    View Details
                  </Button>
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium">Mike Johnson</h3>
                  <p className="text-sm">Applied for: UX/UI Designer</p>
                  <p className="text-xs text-muted-foreground">Applied on May 5, 2023</p>
                </div>
                <div className="flex items-center mt-2 md:mt-0">
                  <Badge className="mr-2" variant="secondary">
                    Accepted
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        "file:///Users/I528949/uploads/resumes/32/b22b64c0-a433-4204-8a74-d6be5747551a.pdf",
                        "_blank"
                      )
                    }
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Applications
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
