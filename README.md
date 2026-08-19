# SafeHer Journey

Create a "Solo Women Safety Companion Web App" called "SafeHer Journey". The app should be highly responsive, mobile-first, and optimized for quick access during emergencies. Use a clean, reassuring UI with dark mode support.

Include the following core pages and features:

1. Dashboard / Home Screen

- Large, prominent "SOS Trigger" button (requires a 3-second hold to prevent accidental taps).

- Quick action buttons: "Share Live Location", "Fake Call Simulator", "Safe Route Planner".

- Real-time safety status indicator ("You are sharing location" or "Secure mode active").

2. AI Safe Route Planner (Map Interface)

- Integration with a map mock-up showing A-to-B routing.

- Filter routes by "Safest" (well-lit, active streets) vs "Fastest".

- Crowd-sourced safety pins where users can view or report well-lit areas, open shops, or sketchy zones.

3. Companion Toolkit

- Fake Call Simulator: Triggers a realistic incoming phone call screen with custom caller name and audio countdown timer.

- Audio/Video Ambient Recorder: Quick-start button to simulate background audio recording.

- Siren / Alarm: A loud panic alarm toggle button.

4. Check-In & Contacts (Safety Network)

- Manage emergency contacts (Name, Phone, Email).

- "Automated Check-In" timer: If the user doesn't check in by a set time, send a simulated alert to contacts.

5. Community Hub

- Anonymous forum/feed for local safety tips, reviews of transit hubs, and recommended safe businesses.

Technical Specs:

- Clean navigation bar (Bottom nav for mobile, top/sidebar for desktop).

- Use Tailwind CSS with a modern color palette (e.g., trustworthy blues, soft purples, and high-visibility reds for SOS).

- Populate the app with realistic mock data so it is immediately interactive.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://safeher-way.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/da07246f-76ea-4438-982f-65d93f09827d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
