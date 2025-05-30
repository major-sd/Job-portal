"use client"

import { useAuth } from "@/context/auth-context"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import ApplicantDashboard from "@/components/dashboard/applicant-dashboard"
import CompanyDashboard from "@/components/dashboard/company-dashboard"
import AdminDashboard from "@/components/dashboard/admin-dashboard"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back, {user.name}!</CardTitle>
            <CardDescription>
              {user.role === "APPLICANT" && "Manage your job applications and profile"}
              {user.role === "COMPANY" && "Manage your job postings and view applications"}
              {user.role === "ADMIN" && "Manage users and monitor the platform"}
            </CardDescription>
          </CardHeader>
        </Card>

        {user.role === "APPLICANT" && <ApplicantDashboard />}
        {user.role === "COMPANY" && <CompanyDashboard />}
        {user.role === "ADMIN" && <AdminDashboard />}
      </div>
    </div>
  )
}
