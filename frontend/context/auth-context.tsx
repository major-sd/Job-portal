"use client"

import { api } from "@/lib/api"
import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "APPLICANT" | "COMPANY" | "ADMIN"
  bio?: string
  resumeUrl?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUserProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")

        if (token) {
          // In a real implementation, this would verify the token with the API
          // const userData = await api.getCurrentUser();
          // setUser(userData);

          // Mock user data for demonstration
          const storedUser = localStorage.getItem("user")
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        }
      } catch (error) {
        console.error("Authentication error:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // In a real implementation, this would call the API
      const { token, user } = await api.login({ email, password });
      console.log("user",user)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      // Mock login for demonstration
      // const mockUsers = [
      //   {
      //     id: "1",
      //     name: "John Doe",
      //     email: "applicant@example.com",
      //     role: "APPLICANT",
      //   },
      //   {
      //     id: "2",
      //     name: "TechCorp Inc.",
      //     email: "company@example.com",
      //     role: "COMPANY",
      //   },
      //   {
      //     id: "3",
      //     name: "Admin User",
      //     email: "admin@example.com",
      //     role: "ADMIN",
      //   },
      // ]

      // const mockUser = mockUsers.find((u) => u.email === email)

      // if (mockUser && password === "password") {
      //   localStorage.setItem("token", "mock-token")
      //   localStorage.setItem("user", JSON.stringify(mockUser))
      //   setUser(mockUser as User)
      // } else {
      //   throw new Error("Invalid credentials")
      // }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  const updateUserProfile = async (data: Partial<User>) => {
    try {
      // In a real implementation, this would call the API
      // const updatedUser = await api.updateProfile(data);
      // localStorage.setItem("user", JSON.stringify(updatedUser));
      // setUser(updatedUser);

      // Mock update for demonstration
      if (user) {
        const updatedUser = { ...user, ...data }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setUser(updatedUser)
      }
    } catch (error) {
      console.error("Profile update error:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
