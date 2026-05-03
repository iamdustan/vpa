# Home Page Narrative & Design Plan

## 1. Objective & Critique of the Scaffold
The initial scaffold failed because it focused too heavily on flashy "tech" buzzwords rather than the core soul of the Virtual Pacing Academy (VPA). It felt like a generic SaaS site, not a mentorship-driven medical academy. 

This plan re-centers the Home Page on the original website's content, utilizing **scrollytelling as a vehicle for empathy and clarity**, not just for the sake of animation. It also restores the full "Virtual Pacing Academy" branding.

## 2. Core Themes to Communicate
Based on the original site, the home page must communicate three distinct points:
1. **The Partnership**: "This is not a content drop... This is a partnership."
2. **The Mentorship**: "Mentorship is the key. Asynchronous learning is inefficient."
3. **The Outcome**: High-quality training for a career as a Clinical Specialists, focused on the student's financial transformation.

## 3. The Narrative Arc (Scroll Journey Script)

We will use GSAP ScrollTrigger to guide the user through a linear narrative. As the user scrolls, the background color shifts subtly, and a continuous visual element (like a glowing EKG line or a "mentorship thread") connects the sections.

### Section 1: The Hook (Hero)
- **Visual**: The full logo "Virtual Pacing Academy" is prominently displayed. A subtle, elegant background animation of a cardiac rhythm or device lead.
- **Copy**: 
  - *Headline*: Transform your financial future with a high-impact career in MedTech.
  - *Subhead*: Get the hands-on education and 1-on-1 mentorship you need to land an entry-level clinical specialist role—without quitting your day job.
- **Action**: A primary "Apply Now" or "Explore the Career" CTA.

### Section 2: The Problem (The Dark Section)
- **Visual**: As the user scrolls, the screen transitions to a deeper dark state. The text fades in slowly, forcing the user to pause and read.
- **Copy**:
  - *Headline*: Asynchronous online learning is inefficient. It just doesn't work well.
  - *Text*: Traditional brick-and-mortar pacing schools require you to quit your job, pay upwards of $30,000, and relocate. Online courses drop videos in your lap and leave you to figure it out alone.

### Section 3: The Turning Point (The Connection)
- **Visual**: A bright "thread" or beam of light shoots down from the top of the screen as you scroll, illuminating the text.
- **Copy**:
  - *Headline*: Mentorship is the key.
  - *Text*: Virtual learning provides flexibility and levels the playing field for anyone seeking to grow. That's why our model combines virtual learning with veteran mentors who will coach you every step of the way.

### Section 4: The Promise (The Partnership)
- **Visual**: The thread splits into multiple nodes, representing the community and 1-on-1 coaching.
- **Copy**:
  - *Headline*: This is not a content drop.
  - *Text*: We don't just give you materials to consume on your own. This is a partnership. We only succeed when you succeed. That's why we go on the journey with you.

### Section 5: The Outcome & CTA
- **Visual**: The UI opens back up into a clean, bright interface. 
- **Copy**:
  - *Highlighting*: "New Scholarships Available!"
  - *Action*: "Let's Work Together" (Contact / Apply).

## 4. Implementation Strategy (GSAP + Astro)
- **The "Thread"**: We will use an SVG `<path>` that "draws" itself down the center of the screen as the user scrolls (`drawSVG` plugin or `stroke-dashoffset` manipulation via ScrollTrigger). This represents the mentorship journey.
- **Typography**: Shift away from the hyper-modern "tech" font back to something authoritative yet approachable (e.g., combining a strong serif for headlines with a clean sans-serif for body text) to reflect the medical/academic nature of the business.
- **Branding**: Explicitly replace "VPA" in the navigation with the full "Virtual Pacing Academy" wordmark.

## 5. Verification
- Does the copy match the tone and exact phrasing of the original site where appropriate?
- Does the scroll animation serve to emphasize the text rather than distract from it?
- Is the full branding restored?