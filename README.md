# Job-portal
Full stack job search portal based on Spring boot and React

# Project Name
- Job Searching Portal

# Project Description
- The Project is aimed at providing complete automation
  in the job search. The portal allows the applicants to
  apply application for various job specifications through
  internet.
  There are three users:
  - Applicant: will search, select and applies for the post.
  - Company users: Post the advertisements for the various
  job specification including details.
  - Admin: will monitor the entire system

# Functional Requirements
1. The Applicant should be able to search for the desired post
     based on location, salary, designation from the first page.
2. The applicant will be allowed to apply for the selected post after
   logging to the system.
3. Registration screen should be there for new users
4. Company users will login to the system to post jobs
   for various job specifications.
5. Users can upload their resumes and can update profile.
6. E-mail notification should be sent to the applicant, company
   user once the post is applied by the applicant.
7. Applicant will see the status of the application that is applied for
   the post.

# Modules
1. Applicant Module
   - Registration
   - Login
   - Search for the job
   - Apply for the job
   - Update profile
   - Upload resume
   - View status of application
2. Company Module
   - Registration
   - Login
   - Post jobs
   - View applications
3. Admin Module
   - Login
   - View all users
   - View all applications
   - View all jobs

# Functionalities
a) Login & Registration
b) Post Resume
c) Apply Jobs
d) Post Jobs by company
e) Track the status
f) E-mail Alerts

# Technologies Used
- Frontend: React.js
- Backend: Spring Boot
- Database: MySQL

# How to Run the Project

## Prerequisites
- Node.js (v18 or above recommended)
- pnpm (or npm/yarn)
- Java 17 or above
- Maven
- MySQL server

## 1. Clone the Repository
```bash
git clone <repository-url>
cd Job-portal
```

## 2. Set Up the Database
- Create a MySQL database (e.g., `job_portal`).
- Update the database credentials in the backend configuration (usually in `src/main/resources/application.properties`).

## 3. Run the Backend
```bash
cd backend
./mvnw spring-boot:run
```
- The backend will start on [http://localhost:8080](http://localhost:8080) by default.

## 4. Run the Frontend
```bash
cd frontend
pnpm install # or npm install or yarn install
pnpm dev     # or npm run dev or yarn dev
```
- The frontend will start on [http://localhost:3000](http://localhost:3000) by default.

## 5. Access the Application
- Open your browser and go to [http://localhost:3000](http://localhost:3000)

## 6. API Documentation
- Swagger UI is available for backend API documentation. Check the `Swagger UI.pdf` or access `/swagger-ui.html` on the backend server if enabled.
- request.http contains endpoints

