"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/context/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BriefcaseIcon, MenuIcon } from "lucide-react"

export default function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all ${
        isScrolled ? "bg-background/95 backdrop-blur-sm border-b" : "bg-background"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                  <BriefcaseIcon className="h-5 w-5" />
                  <span>Job Portal</span>
                </Link>
                <Link href="/jobs" className={`hover:text-primary ${pathname === "/jobs" ? "text-primary" : ""}`}>
                  Jobs
                </Link>
                <Link
                  href="/companies"
                  className={`hover:text-primary ${pathname === "/companies" ? "text-primary" : ""}`}
                >
                  Companies
                </Link>
                <Link href="/about" className={`hover:text-primary ${pathname === "/about" ? "text-primary" : ""}`}>
                  About
                </Link>
                {!user ? (
                  <>
                    <Link href="/auth/login">
                      <Button className="w-full">Login</Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button variant="outline" className="w-full">
                        Register
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/dashboard">
                    <Button className="w-full">Dashboard</Button>
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <BriefcaseIcon className="h-5 w-5" />
            <span>Job Portal</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/jobs"
              className={`hover:text-primary ${pathname === "/jobs" ? "text-primary font-medium" : ""}`}
            >
              Jobs
            </Link>
            <Link
              href="/companies"
              className={`hover:text-primary ${pathname === "/companies" ? "text-primary font-medium" : ""}`}
            >
              Companies
            </Link>
            <Link
              href="/about"
              className={`hover:text-primary ${pathname === "/about" ? "text-primary font-medium" : ""}`}
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {!user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Register</Button>
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.name
                        ?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>
                {user.role === "APPLICANT" && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">My Applications</Link>
                  </DropdownMenuItem>
                )}
                {user.role === "COMPANY" && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/jobs">My Job Postings</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => logout()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
