# Virtual Pacing Academy Marketing Site Plan

## 1. Background & Motivation
The current Virtual Pacing Academy (VPA) website lacks a compelling narrative and a clear user journey. It does not effectively communicate the transformational value of the academy (lowering barriers, 1-on-1 mentorship, career changing outcomes). The goal is to build a new marketing site that leverages interactive, scroll-driven storytelling to guide potential students through the journey of becoming a Clinical Specialist, thereby increasing conversion and clarifying the path to joining.

## 2. Scope & Impact
- **Core Deliverable**: A new web application (built with Astro for zero-JS-by-default performance) integrated as an app within the existing Turborepo workspace.
- **Key Features**: 
  - "Scrollytelling" interactive design to narrate the student journey.
  - Documented Information Architecture (IA).
  - Lightweight Git-based CMS (e.g., Keystatic) for manageable content updates.
  - Integration of PostHog for robust customer-acquisition journey tracking.
- **Future Proofing**: Architecture designed to accommodate future product offerings like books or additional courses.

## 3. Information Architecture (IA)
The site will be structured around the user journey:
- **Home (`/`)**: 
  - *Hero*: The Mentorship Bridge – The transition from current job to Clinical Specialist.
  - *Story/Journey (Scroll-driven)*: The timeline of a VPA student (Apply -> Learn -> Job).
  - *Impact Metrics*: Cost/Time efficiency compared to traditional schools.
  - *Primary CTA*: Apply Now / View Curriculum.
- **Curriculum & Mentorship (`/curriculum`)**: 
  - Syllabus overview.
  - Mentor profiles (highlighting industry experience and diversity focus).
- **Admissions & ROI (`/admissions`)**: 
  - Pricing, Scholarships.
  - "ROI Calculator" comparing tuition vs. starting salary.
- **Future Growth (`/products` or `/books`)**: 
  - Scaffolded routing for upcoming books and resources.

## 4. Proposed Solution & Tech Stack
- **Framework**: Astro. This is ideal for content-heavy sites as it ships zero JavaScript to the client by default, generating fast, static HTML. We can bypass React entirely.
- **Styling & Animation**: Tailwind CSS for styling. For animations, we will use vanilla JavaScript with GSAP (GreenSock) and its ScrollTrigger plugin. This is the industry standard for high-performance scroll animations and avoids the overhead of React-based animation libraries.
- **Content Management**: Keystatic (or TinaCMS). These operate directly on the Git repository (reading/writing Markdown/MDX or JSON), giving the owner a nice UI without needing a complex backend database.
- **Analytics**: PostHog. This will allow us to track the exact funnel (Landing -> Scroll Depth -> Pricing View -> Application Submission) and offer session replays to see where users drop off.

## 5. Alternatives Considered
- *Storytelling*: Considered documentary-style video or purely interactive paths. Chose Scrollytelling for high visual polish and controlled narrative flow.
- *CMS*: Considered no CMS (too hard for non-devs) and Headless CMS like Sanity (overkill for mostly static content). Chose Git-based CMS for the perfect balance of cost, ease of setup, and usability.
- *Analytics*: Considered GA4/Plausible. Chose PostHog because it excels at tracking specific user journeys and funnels, which is critical for understanding customer acquisition here.

## 6. How I Will Be Successful Implementing This
To ensure success, my implementation approach will be:
1. **Component-Driven Development**: I will build the interactive scroll sections as isolated, reusable components to ensure they are performant and testable before integrating them into the main page flow.
2. **Iterative Polish**: Storytelling animations can be finicky. I will implement the base layout and content first, then layer on the GSAP/Framer Motion animations iteratively, verifying cross-browser behavior.
3. **CMS Integration First**: By setting up the Keystatic schema early, we ensure that the content model dictates the UI, making it genuinely easy for the owner to update text/images without breaking the complex animations.
4. **Data-Driven Adjustments**: I will instrument PostHog tracking events on all critical interactive elements from day one, allowing us to validate if the storytelling actually keeps users engaged.

## 7. Implementation Plan (Phased)
- **Phase 1: Foundation & CMS Setup**
  - Scaffold the new Astro app within the monorepo.
  - Configure Keystatic and define schemas for Home page content, Mentors, and Testimonials.
- **Phase 2: Core Pages & IA**
  - Build the static layouts for Curriculum, Admissions, and structural elements (Nav, Footer).
- **Phase 3: The Scrollytelling Experience**
  - Implement the Home page interactive scroll narrative using vanilla JavaScript and GSAP (ScrollTrigger).
  - Wire up the Keystatic content to the interactive components.
- **Phase 4: Analytics & Launch Prep**
  - Integrate PostHog and define key funnel events.
  - Performance profiling and accessibility audits.

## 8. Verification
- Verify all scroll animations perform at 60fps on mobile and desktop.
- Verify content can be successfully updated via the Keystatic local dashboard.
- Verify PostHog events are firing for page views, scroll depth, and CTA clicks.