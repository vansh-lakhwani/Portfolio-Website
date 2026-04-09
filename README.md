# Vansh Portfolio

> **Elevating Digital Experiences through Engineering & Design**

**Vansh Portfolio** is a cutting-edge, highly interactive personal portfolio website showcasing a blend of exceptional software engineering, modern frontend design, and AI integration. It is designed to act as a digital resume that not only lists accomplishments but demonstrates technical proficiency through an interactive, visually stunning interface. It addresses the need for a memorable professional presence by incorporating an AI chatbot, seamless animations, and a rich user experience.

---

## 🌟 Key Features

1. **AI-Powered Chatbot (VanshBot)**  
   * **What it does:** An embedded intelligent assistant that answers recruiter or client questions about the developer's experience, skills, and availability in real-time.  
   * **Why it is useful:** It provides immediate, contextual information to visitors without requiring them to read through text, making the portfolio highly engaging and memorable.  
   * **Technologies used:** OpenAI/Groq API, React Markdown, Next.js API Routes, Tailwind CSS.

2. **Interactive Kinetic UI Elements**  
   * **What it does:** Smooth transitions, scroll-based progress indicators, and dynamic section fading as the user navigates the page, led by a custom interactive cursor.  
   * **Why it is useful:** Enhances visual appeal and user engagement, demonstrating a deep understanding of frontend aesthetics and user experience design.  
   * **Technologies used:** Framer Motion, Custom React Hooks (`CustomCursor.tsx`, `ScrollProgress.tsx`, `SectionFade.tsx`).

3. **Dynamic Project & Skills Showcase**  
   * **What it does:** Visually structured presentation of professional skills, personal projects, education, and certifications with skeleton loading states for performance.  
   * **Why it is useful:** Allows recruiters and engineering managers to evaluate technical depth quickly in a beautifully structured format.  
   * **Technologies used:** React Server Components, Tailwind CSS, Lucide React icons.

4. **Integrated Contact & Scheduling System**  
   * **What it does:** Allows visitors to either send direct emails via a built-in contact form or seamlessly schedule a meeting directly from the portfolio.  
   * **Why it is useful:** Removes friction in the hiring or contracting process by keeping the user on the platform.  
   * **Technologies used:** Nodemailer, Next.js Serverless Functions, React Hook Form (typically).

---

## 🛠 Tech Stack (Very Detailed)

### 💻 Frontend
- **Framework:** Next.js (14.2)
- **Library:** React (18), including React DOM and concurrent features
- **Global Styling:** Tailwind CSS (3.4) with custom utility classes & PostCSS
- **Animations:** Framer Motion (for physics-based micro-interactions and layout transitions)
- **Iconography:** Lucide React
- **Markdown Rendering:** React-Markdown (for formatting the Chatbot's AI responses)

### ⚙️ Backend
- **Architecture:** Next.js Serverless API Routes (`app/api/*`)
- **Server Environment:** Node.js (v20 types)
- **Serverless Functions:** Handling AI streams and secure email delivery seamlessly

### 🤖 AI/ML Integration
- **LLM APIs:** Integration with OpenAI API & Groq API
- **Purpose:** Powering the `VanshBot` component for natural language understanding and real-time generation.

### 🔐 Authentication & Security
- **API Security:** Environment variables for securing OpenAI/Groq API keys.
- **Email Security:** Nodemailer authenticated via Gmail App Passwords (`GMAIL_USER`, `GMAIL_APP_PASSWORD`).

### 🚀 DevOps & Deployment (Expected)
- **Hosting Platform:** Vercel (Optimized for Next.js)
- **CI/CD:** Automated builds and deployments synchronized through GitHub.
- **Environment Management:** Multi-environment config (`.env.local`, `.env.example`).

---

## 🏛 Architecture & System Design

The application follows a modern serverless edge architecture leveraging the Next.js App Router for maximal performance.

**End-to-End Flow:**
1. **User Interaction**: The user accesses the static/ISR rendered frontend. They interact with the Custom Cursor, trigger Framer Motion animations on scroll, and view the Skills/Projects.
2. **AI Chatbot Request**: The user asks a question via the `ChatBot` UI.
3. **API Routing**: A request is fired to the Next.js Serverless function at `/api/chat`.
4. **LLM Processing**: The serverless function securely relays the request to the OpenAI or Groq API, obscuring API keys from the client.
5. **Real-time Response**: The AI response is streamed back to the frontend and rendered elegantly using `react-markdown`.
6. **Email Flow (Contact)**: If the user fills out the contact form, the data is sent to `/api/contact`, where `Nodemailer` securely authenticates with an SMTP server (Gmail) to deliver the message to the developer.

---

## 🗺 Feature-wise Tech Mapping

| Feature | Description | Tech Used | Backend Logic | APIs/Services |
|---------|-------------|-----------|---------------|---------------|
| **AI VanshBot** | Intelligent conversational agent for visitors | React, Framer Motion, React-Markdown | Proxies prompt to LLM to protect API keys (`/api/chat`) | OpenAI API / Groq API |
| **Contact Form** | Direct emailing from UI | React, Tailwind CSS | Parses payload and uses SMTP to send email (`/api/contact`) | Nodemailer, Gmail SMTP |
| **Custom Cursor** | Replaces default OS cursor with interactive blob | React Hooks (`useEffect`, `useState`), Framer Motion | N/A (Client-side only) | N/A |
| **Project Showcase** | Grid display of projects with Loading states | Next.js, React Suspense, Tailwind CSS | Optional GitHub repo fetching | GitHub Data APIs (if dynamic) |
| **Smooth UI Routing**| Navigation, Section Fade, Scroll Progress | framer-motion, Next.js `<Link>` | N/A (Client-side routing via App Router)| N/A |

---

## 📦 Installation & Setup

### Prerequisites
- Node.js `v18+` (Recommended `v20`)
- npm, yarn, pnpm, or bun installed
- API Access keys for OpenAI/Groq and an App Password from Gmail.

### Step-by-Step Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/vansh-portfolio.git
   cd vansh-portfolio
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory based off `.env.example`.
   ```env
   # API Keys
   OPENAI_API_KEY=your_openai_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   
   # Mailing Configuration
   GMAIL_USER=your_email@gmail.com
   GMAIL_APP_PASSWORD=your_app_password
   CONTACT_RECEIVER=where_to_send_emails@example.com
   
   # Socials
   NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/vansh
   ...
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🖥 Usage Guide

- **General Navigation:** Scroll through the single-page application to trigger section fade-ins. The header allows quick-jumping to sections (Projects, Skills, Education).
- **VanshBot Usage:** Click on the chat bubble in the bottom corner. Ask questions like: *"What is Vansh's strongest programming language?"* or *"What did Vansh build recently?"*.
- **Contacting:** Scroll to the footer or Contact section, fill out the Name, Email, and Message. An automated confirmation toast will appear upon successful dispatch.

---

## 🔌 API Documentation

### `POST /api/chat`
Handles AI queries from the frontend chatbot.

- **Request Body (JSON):**
  ```json
  {
    "messages": [
      { "role": "user", "content": "Tell me about your React experience." }
    ]
  }
  ```
- **Response:** Streams text chunks yielding a markdown-formatted block.

### `POST /api/contact`
Handles the submission of the Contact form.

- **Request Body (JSON):**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I would like to hire you."
  }
  ```
- **Response:**
  ```json
  { "success": true, "message": "Email sent successfully" }
  ```

---

## 📸 Screenshots / Demo

*(Replace placeholder text with actual images/GIFs of the portfolio)*

- **Hero Section & Custom Cursor:** `[Placeholder: Hero Image]`
- **VanshBot in Action:** `[Placeholder: Chatbot GIF]`
- **Projects Grid:** `[Placeholder: Projects Image]`

---

## 💎 Unique Highlights

- **VanshBot Intregration:** Replaces static "About Me" pages with a highly conversational, RAG-style (Retrieval-Augmented Generation) entity that genuinely surprises recruiters.
- **Micro-Interactions over Clutter:** The use of a Custom Cursor and specific Framer Motion layout transitions provide a highly tailored, "award-awinning website" feel without sacrificing performance.
- **Type-Safety & Scalability:** Built firmly on TypeScript and Next.js 14 App Router principles ensuring the codebase scales and components remain strongly typed.

---

## 🚧 Challenges & Solutions

- **Challenge:** *Maintaining 60fps animations alongside heavy DOM elements (like the embedded chatbot and project grids).*
  **Solution:** Shifted animation calculations to Framer Motion specifically utilizing internal `useTransform` and `useSpring` hooks to keep layout recalcs off the main thread where possible, using Server Components to reduce the JavaScript bundle size.
  
- **Challenge:** *Preventing AI Abuse / API Key leaks.*
  **Solution:** Abstracted the AI calls entirely to Edge/Serverless Next.js API Routes rather than fetching directly from the client. Implemented rate limits and strictly defined system prompts to keep the AI on-topic.

---

## 🔮 Future Improvements / Roadmap

- [ ] Connect a CMS (Sanity or Contentful) to allow dynamic updating of projects and skills without pushing code changes.
- [ ] Add 3D elements using Three.js / React Three Fiber in the Hero section.
- [ ] Enhance VanshBot via LangChain to allow it to read the user's uploaded resume dynamically.
- [ ] Implement robust edge-based rate-limiting for the contact and chat APIs using Upstash Redis.

---

## 🤝 Contributing Guidelines

This is primarily a personal portfolio project, but feedback and minor design PRs are wildly appreciated! 
1. Fork the repo.
2. Create a new Feature branch (`git checkout -b feature/CoolAnimation`).
3. Commit your changes (`git commit -m 'Added cool animation'`).
4. Push to the branch (`git push origin feature/CoolAnimation`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Please feel free to use it as inspiration, but kindly create your own design assets and modify the project details!

---

## 👨‍💻 Author / Credits

Designed and Engineered by **Vansh**.

- LinkedIn: [Your Profile](https://linkedin.com/in/)
- GitHub: [Your GitHub](https://github.com/yourusername)
- Twitter/X: [@yourhandle](https://twitter.com)

> Made with ❤️ and Next.js.
