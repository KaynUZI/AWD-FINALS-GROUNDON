Savant Solutionz - Groundon Project Plan
1. Persona
Name: Pet Lover
Age: 33 years old
Background:

A pet owner who treats their furry friends as family and seeks the best products and services for pet care.
The idea is to integrate health tracking, appointment scheduling, and a community forum, making pet ownership more organized and enjoyable.
Key Characteristics:

Practical and responsible, with a strong desire to ensure the health and happiness of their pets.
Seeks expert advice and community support.
Values trustworthy and quality pet care products and services.
Prefers a user-friendly and intuitive app interface for convenience
2. UX Flow
User Authentication:

Login/Registration: Secure sign-in via Firebase Authentication.
Home Screen:

Showing About Us and members who helped in the project
Navigation Menu: Links for Home, Our Services, Forums, Sign in, Projects


Project Detail: DIY Home improver that is easy to access for all audience and where they can see the examples of our past projects and our previous customers who avail.
Community Engagement:

Forum: Submit Request, Ratings and their forums
Admin Workflow:

Admin Dashboard: Can Edit and view request in the website for the customers who wants to avail and their request.
Navigation Drawer / Bottom Navigation Bar:

Home: Can see about us and members who helped develop the website.
Our Services: Can see the services that we do.
Projects: Where you can see the past customers who inquire in our website.
Forums: Can submit request, Ratings and forums.

Screen Layouts:

Homepage: About us page where you see the members.  
Our Services: Services of the website and the company.
Projects: Past works of the team.
Forums: Thread-based discussions with categories and search features.
Consistent Navigation:

Smooth transitions, clear back navigation, and intuitive UI components for ease of use.
4. Color Scheme and Visual Style

Primary Colors:

Beige: A warm neutral tone, providing a soft and friendly background.
Orange: A vibrant and energetic hue, radiating warmth, enthusiasm, and creativity.

Accent Colors:

Soft Cream/Off-White – Used as the background for text-heavy sections, ensuring readability while keeping the interface light and inviting.

Orange – A dominant accent color that adds warmth and energy, reinforcing a sense of enthusiasm and creativity.

Dark Brown/Black – Used for text and buttons, providing strong readability and contrast.

Muted Gold/Warm Yellow – Highlight color for call-to-action buttons like "ORDER NOW," drawing user attention.

Subtle Beige Shades – Balances the color palette, maintaining a professional yet friendly appearance.

5. Entity Relational Database (ERD)
Key Entities:

User

user_id (Primary Key)

name

email

password_hash

profile_image_url

date_joined

DIY_Project

project_id (Primary Key)

user_id (Foreign Key - User)

title

description

image_url

materials_list (Array/String)

steps (Array of steps)

approved (Boolean)

timestamp

Review

review_id (Primary Key)

project_id (Foreign Key - DIY_Project)

user_id (Foreign Key - User)

rating (Numeric)

comment

timestamp

Forum_Thread

thread_id (Primary Key)

user_id (Foreign Key - User)

title

content

timestamp

Forum_Reply

reply_id (Primary Key)

thread_id (Foreign Key - Forum_Thread)

user_id (Foreign Key - User)

comment

timestamp

6. Dataflow
User Authentication & Registration:

Firebase Authentication is used to create new users or sign in existing ones.
Dataflow: User credentials → Firebase Auth → Secure session token.
Health Tracking & Appointments Submission:

User Action: Logs pet health data and schedule vet appointments.

Dataflow:

User inputs (text, images) → Firebase Firestore for storages.

System sends reminders for upcoming appointments.

Admin reviews and updates approved to true .

Community Forum Interaction:

User Action: Post questions, discussions, or reviews.

Dataflow:

User submits post -> Stored in Firestore under Community_Post collection.
Real-time updates via Firebase's real-time database capabilities.
Forum Interaction:

Dataflow:

User posts a thread/reply → Stored in Firestore under Forum_Thread and Forum_Reply collections.
Real-time updates via Firebase’s real-time database capabilities allow immediate discussion updates.
Admin Confirmation Workflow:

Dataflow:

New submissions trigger notifications (using Cloud Functions) → Admin dashboard accesses pending projects/reviews.
On approval, admin updates project’s approved flag → Changes reflected in the public display.
