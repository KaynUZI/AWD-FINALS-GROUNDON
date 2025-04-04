Savant Solutionz - Website Project Plan
1. Persona
Name: DIY Enthusiast Age: 29 years old Background: A creative individual who loves hands-on projects and finds joy in transforming their space into something unique. They seek easy-to-follow guides, inspiring ideas, and convenient tools to bring their visions to life.

Key Characteristics:

Resourceful and driven, with a flair for creativity and innovation.

Values practical and budget-friendly DIY solutions.

Prefers a clean, intuitive platform to access tutorials and supplies.

2. UX Flow
User Authentication:

Login/Registration: Secure sign-in via Firebase Authentication.

Home Screen:

Display "About Us" and contributors who helped create the platform.

Navigation Menu: Links for Home, Services, Projects, Forums, and Sign In.

Project Detail:

Highlight accessible DIY projects, showcasing past successes and testimonials.

Community Engagement:

Forum Features: Create, rate, and interact with threads about DIY topics.

Admin Workflow:

Admin Dashboard: Manage user submissions, approve projects, and monitor community activity.

Navigation Drawer/Bottom Navigation Bar:

Home: Overview of the platform and contributors.

Services: List of DIY resources and tools.

Projects: Success stories from users and examples of past projects.

Forums: Central hub for discussions and sharing ideas.

3. Screen Layouts
Homepage: Introduction to Savant Solutionz and contributor profiles.

Our Services: Highlight of DIY resources available through the platform.

Projects: Showcase of past DIY successes, with detailed guides and customer feedback.

Forums: Interactive space for thread-based discussions and project collaboration.

Consistent Navigation:

Smooth transitions and intuitive interface for effortless browsing.

4. Color Scheme and Visual Style
Primary Colors:

Beige: Soft background for a welcoming feel.

Orange: Vibrant highlight to bring energy and focus.

Accent Colors:

Cream/Off-White: Ensure readability and a light tone.

Dark Brown/Black: High contrast for buttons and text clarity.

Muted Gold/Warm Yellow: Eye-catching buttons like "Explore Projects."

Subtle Beige Shades: Maintain a professional yet friendly appearance.

5. Entity Relational Database (ERD)
Key Entities:

User

user_id: Primary Key

name, email, password_hash, profile_image_url, date_joined

DIY_Project

project_id: Primary Key

user_id: Foreign Key

title, description, image_url, materials_list, steps, approved, timestamp

Forum_Thread

thread_id: Primary Key

user_id: Foreign Key

title, content, timestamp

Forum_Reply

reply_id: Primary Key

thread_id: Foreign Key

user_id: Foreign Key

comment, timestamp

6. Dataflow
User Authentication & Registration:

Credentials → Firebase Authentication → Secure token.

Project Submission:

User input → Firebase Firestore → Admin review → Approval flag updated.

Forum Interaction:

User threads/replies → Firestore → Real-time updates via Firebase database.

Admin Workflow:

Submissions trigger notifications → Admin actions reflected across the platform.