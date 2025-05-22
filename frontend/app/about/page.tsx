"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <section className="container mx-auto py-16 px-4 md:px-8">
      <Card className="max-w-3xl mx-auto text-center mb-12 border-0 shadow-none bg-transparent">
        <CardHeader>
          <CardTitle asChild>
            <h1 className="text-5xl font-extrabold mb-4 text-primary">About Us</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-xl text-muted-foreground mb-6">
            Empowering careers. Connecting talent. Building the future of work.
          </p>
          <p className="text-lg text-muted-foreground">
            Job Search Portal is dedicated to bridging the gap between ambitious job seekers and forward-thinking companies. Our platform is designed to make job discovery, application, and hiring seamless, transparent, and rewarding for everyone.
          </p>
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-16">
        <Card className="flex flex-col items-center">
          <CardHeader>
            <CardTitle className="text-primary">For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 text-left">
              <li>Explore thousands of curated job listings across diverse industries.</li>
              <li>Build a standout profile and upload your resume in seconds.</li>
              <li>Apply to jobs with one click and track your application status in real time.</li>
              <li>Receive personalized job recommendations tailored to your skills and interests.</li>
              <li>Access resources and tips to boost your career journey.</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center">
          <CardHeader>
            <CardTitle className="text-primary">For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 text-left">
              <li>Post job openings and manage applications with an intuitive dashboard.</li>
              <li>Discover top talent using advanced search and smart filters.</li>
              <li>Showcase your company brand and culture to attract the best candidates.</li>
              <li>Communicate directly with applicants and streamline your hiring process.</li>
              <li>Gain insights with analytics and reporting tools.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <Card className="max-w-2xl mx-auto text-center mb-12">
        <CardHeader>
          <CardTitle className="text-primary text-xl font-semibold mb-2">Our Values</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-wrap justify-center gap-4 text-muted-foreground text-base">
            <li className="bg-zinc-100 dark:bg-zinc-800 rounded px-4 py-2">Transparency</li>
            <li className="bg-zinc-100 dark:bg-zinc-800 rounded px-4 py-2">Diversity & Inclusion</li>
            <li className="bg-zinc-100 dark:bg-zinc-800 rounded px-4 py-2">Empowerment</li>
            <li className="bg-zinc-100 dark:bg-zinc-800 rounded px-4 py-2">Innovation</li>
            <li className="bg-zinc-100 dark:bg-zinc-800 rounded px-4 py-2">Community</li>
          </ul>
        </CardContent>
      </Card>
      <div className="text-center text-muted-foreground">
        {/* <p className="mb-2">
          <span className="font-semibold">Contact us:</span> <a href="mailto:support@jobportal.com" className="underline">support@jobportal.com</a>
        </p>
        <Button asChild variant="outline" className="mb-4">
          <a href="mailto:support@jobportal.com">Email Support</a>
        </Button> */}
        {/* <p className="text-sm">&copy; {new Date().getFullYear()} Job Search Portal. All rights reserved.</p> */}
      </div>
    </section>
  )
}