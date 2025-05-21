import { ApplicationCard } from "@/components/dashboard/application-card"

export type Application = {
  id: number
  job: {
    id: number
    title: string
    description: string
    company: {
      id: number
      name: string
      email: string
      password: string
      role: string
      createdAt: string
      active: boolean
      companyProfile: null
    }
    location: string
    salaryRange: string
    postedAt: string
    requirements: string[]
    responsibilities: string[]
    active: boolean
  }
  applicant: {
    id: number
    name: string
    email: string
    password: string
    role: string
    createdAt: string
    active: boolean
    companyProfile: null
  }
  resumeUrl: string
  status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED"
  appliedAt: string
}

export function ApplicationsList({ applications }: { applications: Application[] }) {
  return (
    <div className="grid gap-6">
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
    </div>
  )
}
