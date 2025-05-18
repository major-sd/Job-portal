"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BriefcaseIcon, UsersIcon, BuildingIcon } from "lucide-react"

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, this would fetch from the API
        // const usersData = await api.getAllUsers();
        // const jobsData = await api.getAllJobs();
        // setUsers(usersData);
        // setJobs(jobsData);

        // Mock data for demonstration
        setUsers([
          {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            role: "APPLICANT",
            active: true,
            createdAt: "2023-04-15T00:00:00Z",
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            role: "APPLICANT",
            active: true,
            createdAt: "2023-04-20T00:00:00Z",
          },
          {
            id: "3",
            name: "TechCorp Inc.",
            email: "hr@techcorp.com",
            role: "COMPANY",
            active: true,
            createdAt: "2023-03-10T00:00:00Z",
          },
          {
            id: "4",
            name: "DataSystems Ltd.",
            email: "careers@datasystems.com",
            role: "COMPANY",
            active: true,
            createdAt: "2023-03-15T00:00:00Z",
          },
          {
            id: "5",
            name: "Admin User",
            email: "admin@jobportal.com",
            role: "ADMIN",
            active: true,
            createdAt: "2023-01-01T00:00:00Z",
          },
        ])

        setJobs([
          {
            id: "1",
            title: "Senior Frontend Developer",
            company: { name: "TechCorp Inc." },
            isActive: true,
            applicationsCount: 12,
            postedAt: "2023-05-01T00:00:00Z",
          },
          {
            id: "2",
            title: "Backend Engineer",
            company: { name: "DataSystems Ltd." },
            isActive: true,
            applicationsCount: 8,
            postedAt: "2023-05-03T00:00:00Z",
          },
          {
            id: "3",
            title: "UX/UI Designer",
            company: { name: "Creative Solutions" },
            isActive: false,
            applicationsCount: 5,
            postedAt: "2023-05-05T00:00:00Z",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // In a real implementation, this would call the API
      // await api.updateUserStatus(userId, !currentStatus);

      // Update local state for demonstration
      setUsers(users.map((user) => (user.id === userId ? { ...user, active: !currentStatus } : user)))
    } catch (error) {
      console.error("Error updating user status:", error)
    }
  }

  const toggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    try {
      // In a real implementation, this would call the API
      // await api.updateJobStatus(jobId, !currentStatus);

      // Update local state for demonstration
      setJobs(jobs.map((job) => (job.id === jobId ? { ...job, isActive: !currentStatus } : job)))
    } catch (error) {
      console.error("Error updating job status:", error)
    }
  }

  return (
    <Tabs defaultValue="users">
      <TabsList className="mb-4">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="jobs">Jobs</TabsTrigger>
        <TabsTrigger value="stats">Statistics</TabsTrigger>
      </TabsList>

      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage all users on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading users...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm">{user.email}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{user.role}</Badge>
                        <p className="text-xs text-muted-foreground">
                          Joined on {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0">
                      <Button
                        variant={user.active ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleUserStatus(user.id, user.active)}
                        className="mr-2"
                      >
                        {user.active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="jobs">
        <Card>
          <CardHeader>
            <CardTitle>All Jobs</CardTitle>
            <CardDescription>Manage all job postings on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading jobs...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <h3 className="font-medium">{job.title}</h3>
                      <p className="text-sm">{job.company.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={job.isActive ? "default" : "outline"}>
                          {job.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          Posted on {new Date(job.postedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0">
                      <Button
                        variant={job.isActive ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleJobStatus(job.id, job.isActive)}
                        className="mr-2"
                      >
                        {job.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="stats">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                {users.filter((u) => u.role === "APPLICANT").length} applicants,{" "}
                {users.filter((u) => u.role === "COMPANY").length} companies
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs.filter((j) => j.isActive).length}</div>
              <p className="text-xs text-muted-foreground">Out of {jobs.length} total jobs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <BuildingIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs.reduce((acc, job) => acc + job.applicationsCount, 0)}</div>
              <p className="text-xs text-muted-foreground">Across all job postings</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
