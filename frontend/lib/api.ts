// const multer = require('multer');
// const path = require('path');
// API client for interacting with the backend

const API_BASE_URL = "http://localhost:8080/api"

// Helper function to get the auth token
const getToken = () => localStorage.getItem("token")

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "An error occurred")
  }
  return response.json()
}

export const api = {
  // Auth endpoints
  async register(data: { name: string; email: string; password: string; role: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async login(data: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  // Job endpoints
  async getJobs(params = {}) {
    const queryParams = new URLSearchParams(params as Record<string, string>)
    const response = await fetch(`${API_BASE_URL}/jobs?${queryParams}`)
    return handleResponse(response)
  },

  async getCompanyJobs() {

    const response = await fetch(`${API_BASE_URL}/jobs/company`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      }
    })
    return handleResponse(response)
  },
  async getApplicantsForAJob(jobId:number) {

    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/applications`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      }
    })
    return handleResponse(response)
  },


async updateJobActiveStatus(id: string, active: boolean) {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}/status?active=${active}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return handleResponse(response)
},
async updateApplicationStatus(id: number, status:string) {
  const response = await fetch(`${API_BASE_URL}/jobs/applications/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({status:status})
  })
  return handleResponse(response)
},

  async getJobById(id: string) {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`)
    return handleResponse(response)
  },

  async createJob(data: any) {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async uploadResume(data: any) {
    const formData = new FormData()
    formData.append("file", data)
    const response = await fetch(`${API_BASE_URL}/applicant/resume`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    })
    return handleResponse(response)
  },

  async updateJobStatus(id: string, active: boolean) {
    const response = await fetch(`${API_BASE_URL}/admin/jobs/${parseInt(id,10)}/status?active=${active}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    return handleResponse(response)
  },

  // Applicant endpoints
  async getApplicantProfile() {
    const response = await fetch(`${API_BASE_URL}/applicant/profile`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    return handleResponse(response)
  },

  async getMyApplications() {
    const response = await fetch(`${API_BASE_URL}/applicant/applications`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    return handleResponse(response)
  },

  async applyForJob(jobId: string, data: { resumeUrl: string }) {
    const response = await fetch(`${API_BASE_URL}/applicant/apply/${jobId}?resumeUrl=${data.resumeUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  // Company endpoints
  async getJobApplications(jobId: string) {
    const response = await fetch(`${API_BASE_URL}/company/jobs/${jobId}/applications`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    return handleResponse(response)
  },

  // Admin endpoints
  async getAllUsers() {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    return handleResponse(response)
  },
    async getAllJobs() {
    const response = await fetch(`${API_BASE_URL}/admin/jobs`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    return handleResponse(response)
  },

  async updateUserStatus(id: number, active: boolean) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/status?active=${active}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    return handleResponse(response)
  },
}
