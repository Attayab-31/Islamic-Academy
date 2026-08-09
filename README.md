# Islamic Academy Platform

This project is a production-ready Next.js application for an international online Islamic academy.

## What is included
- Marketing site with course, program, teacher, pricing, FAQ, safeguarding, contact, and resources pages
- Booking flow for free trials
- Direct-transfer enrollment workflow with admin review
- Family portal and payment instruction pages
- Prisma-backed data persistence for bookings and enrollments

## Local development
1. Install dependencies: npm install
2. Generate Prisma client: npm run db:generate
3. Push the database schema: npm run db:push
4. Start the development server: npm run dev

## Production readiness notes
- The app uses server components by default and a dynamic API-driven booking/enrollment flow.
- Admin review pages and operations views are present for family onboarding.
- Monthly block enrollments now create recurring class sessions and send reminder emails before each class starts.
- The cron endpoint for monthly blocks is available at /api/cron/monthly-blocks and should be protected with a CRON_SECRET in production.
- For local testing, call the cron endpoint with the same secret in the x-cron-secret header.
