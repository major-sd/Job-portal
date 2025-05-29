"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

export default function CompanyPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true)
        const users = await api.getAllUsers()
        const companyUsers = users.filter((u: any) => u.role === "COMPANY")
        setCompanies(companyUsers)
        setError(null)
      } catch (err: any) {
        setError(err.message || "Failed to load companies")
      } finally {
        setLoading(false)
      }
    }
    fetchCompanies()
  }, [])

  const handleCompanyClick = (company: any) => {
    router.push(`/dashboard?companyId=${company.id}&companyName=${encodeURIComponent(company.name)}`)
  }

  if (loading) {
    return <div className="container py-10 text-center">Loading companies...</div>
  }
  if (error) {
    return <div className="container py-10 text-center text-red-500">{error}</div>
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Browse Companies</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {companies.map((company) => (
          <Card key={company.id} className="cursor-pointer hover:shadow-lg transition" onClick={() => handleCompanyClick(company)}>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold mb-4">
                {company.name?.[0] || "C"}
              </div>
              <div className="font-semibold text-lg mb-2">{company.name}</div>
              <div className="text-muted-foreground text-sm mb-4">{company.email}</div>
              <Button variant="outline" className="w-full">View Jobs</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
