# LeadFlow – Lead Management and Opportunity Management System

## 1. Project Overview

LeadFlow is a web-based ERP mini-project designed to manage leads, convert leads into business opportunities, and maintain a catalog of products and services. It provides role-based access for administrators and regular users.

## 2. Objectives

- Register and manage customer leads.
- Store lead contact details and requirements.
- Track lead warmth and next steps.
- Convert leads into opportunities without duplicate conversions.
- Record opportunity amounts and expected profit margins.
- Manage products and services through an administrator-only catalog.
- Protect application features using authentication and role-based authorization.

## 3. Technologies Used

- Frontend: Next.js and React
- Programming Language: TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- Authentication: JWT sessions using Jose
- Password Hashing: bcryptjs
- Styling: CSS

## 4. Main Features

### Lead Management
- Create leads with contact information and requirements.
- Select lead warmth: Curious, Interested, or Ready Now.
- Select a next step.
- View lead details and creation date.
- Convert a lead into an opportunity.

### Opportunity Management
- Link opportunities to existing leads.
- Select an active product or service.
- Enter the total amount and expected margin percentage.
- Prevent duplicate conversions for the same lead.
- View saved opportunities and their financial details.

### Product and Service Management
- View and manage products and services.
- Add and edit catalog items.
- Activate or deactivate catalog items.
- Prevent duplicate catalog entries.
- Restrict catalog management to administrators.

### Authentication and Authorization
- Log in using registered credentials.
- Support administrator and regular-user roles.
- Protect API endpoints against unauthorized access.
- Hash passwords before storing them.
- Provide a logout function.

## 5. Prerequisites

Install the following before running the project:

- Node.js and npm
- PostgreSQL
- Visual Studio Code (recommended)

## 6. Project Setup

Clone or copy the project folder to your computer and open a terminal in the project directory.

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root. Add your local PostgreSQL connection string and a secure session secret:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/lead_management_erp?schema=public"
SESSION_SECRET="replace_with_your_own_random_secret"
```

Replace `USER` and `PASSWORD` with your local PostgreSQL credentials. Generate a secure session secret for your local environment. Do not commit real credentials or secrets to source control.

## 7. Database Setup

Make sure PostgreSQL is running and the `lead_management_erp` database exists.

Generate the Prisma client:

```bash
npx prisma generate
```

If the project already contains Prisma migrations, apply them using:

```bash
npx prisma migrate dev
```

If no migrations exist yet, synchronize the schema with the database using:

```bash
npx prisma db push
```

Use the appropriate database setup command for the current project state.

## 8. Create User Accounts

Create an administrator account:

```bash
npx tsx prisma/create-admin.ts
```

Create a regular user account:

```bash
npx tsx prisma/create-user.ts
```

Follow the prompts and use the credentials you create to log in. Do not store passwords in this README.

## 9. Run the Application

Start the development server:

```bash
npm run dev
```

Open the following URL in your browser:

http://localhost:3000

Log in using an account created in the previous step.

## 10. Main Application Pages

- Dashboard: `/`
- Leads: `/leads`
- Create Lead: `/leads/new`
- Opportunities: `/opportunities`
- Product and Service Catalog: `/admin/catalog` (administrator only)
- Login: `/login`

## 11. Testing

Verify the following workflows:

1. Log in as an administrator.
2. Create a new lead and confirm it appears in the leads list.
3. Open the lead details.
4. Convert the lead into an opportunity.
5. Verify the opportunity appears in the opportunities list.
6. Confirm the same lead cannot be converted twice.
7. Add or edit a product or service as an administrator.
8. Confirm regular users cannot manage the catalog.
9. Verify unauthorized API requests are rejected.
10. Log out and confirm that protected actions require authentication.

## 12. Security Considerations

- Passwords are stored as hashes.
- Session cookies are configured with security protections.
- API endpoints check authentication and authorization.
- Catalog administration is restricted to administrator accounts.
- Environment variables are used for database credentials and session secrets.

## 13. Conclusion

LeadFlow provides a basic ERP workflow for lead tracking, opportunity conversion, and product and service catalog management. It combines a responsive web interface, persistent PostgreSQL storage, input validation, and role-based access control.
