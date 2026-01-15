# Qene Forms - Project Documentation

## 1. Executive Summary
**Qene Forms** is a modern, client-side web application designed to revolutionize how developers and non-technical users create web forms. By leveraging local AI (TensorFlow.js), the application allows users to generate complex, validated, and styled forms simply by typing natural language prompts (e.g., *"Create a job application form with resume upload"*).

Unlike traditional drag-and-drop builders, this tool understands context and intent, generating not just the visual layout but also production-ready code for multiple frameworks (React, Vue, Svelte, Angular, etc.). Recent updates have further enhanced the experience with a "Terminal/CLI" aesthetic, improved mobile responsiveness, and a fully modularized editor architecture.

---

## 2. Technical Architecture

### 2.1 Core Stack
The application is built on a cutting-edge frontend stack, ensuring high performance and a premium developer experience.
*   **Framework:** React 19 (Latest) with TypeScript.
*   **Build Tool:** Vite 7 (Excedingly fast HMR and build).
*   **Styling:** Tailwind CSS 4 (Atomic CSS engine) + Shadcn/UI (Radix Primitives).
*   **Routing:** `wouter` (Minimalist, modern routing).
*   **State Management:** Zustand (Lightweight global state).
*   **Animations:** Framer Motion & GSAP (Complex interactions).
*   **3D Graphics:** React Three Fiber / Drei (Interactive hero elements).

### 2.2 The "Brain": Client-Side AI Engine
A standout feature is that **no data leaves the user's browser**. The AI runs entirely locally.
*   **Library:** `TensorFlow.js` (`@tensorflow/tfjs`).
*   **Model:** Universal Sentence Encoder (USE).
*   **Mechanism:**
    1.  **Vector Embeddings:** The app loads a pre-trained model to convert text into numerical vectors (embeddings).
    2.  **Semantic Search:** It calculates the "Cosine Similarity" between the user's prompt and a predefined "Knowledge Base" of form templates and field concepts.
    3.  **Hybrid Parsing:**
        *   **Top-Down:** First, it tries to match the prompt to a full template (e.g., "User Registration").
        *   **Bottom-Up:** If no template matches, it breaks the sentence into chunks and matches them to individual field types.

### 2.3 Project Structure
The codebase has been refactored for modularity and maintainability:
```
src/
├── ai/                 # The AI Brain
│   ├── generator.ts    # Main logic: Prompt -> Form Fields
│   ├── model.ts        # TensorFlow model loader & embedding engine
│   └── knowledge.ts    # Pre-defined templates (Registration, Contact, etc.)
├── components/
│   ├── ai-editor/      # The Core Application Workspace (Modularized)
│   │   ├── Canvas.tsx          # Droppable area for form fields
│   │   ├── SidebarLeft.tsx     # Tools, Drag-and-Drop source
│   │   ├── SidebarRight.tsx    # Property editors
│   │   ├── Header.tsx          # Editor controls & status
│   │   ├── ExportModal.tsx     # Code export interface
│   │   ├── DraggableField.tsx  # Drag source components
│   │   ├── DroppableCanvas.tsx # Drop target logic
│   │   └── codeGenerator.ts    # Transpiler: Fields -> Source Code
│   ├── home/           # Landing Page (Hero, Features, Workflow, etc.)
│   └── ui/             # Reusable UI components (TerminalPopup, etc.)
├── pages/              # Route views (Home, Dashboard)
└── lib/                # Utilities and shared configurations
```

---

## 3. Core Features & Logic Deep Dive

### 3.1 The AI Generation Flow
When a user types *"Make a subscription form with newsletter checkbox"*:
1.  **Input Processing:** The prompt is cleaned and tokenized.
2.  **Understanding:** The system identifies high-level intents. It can now recognize full templates (e.g., "Registration") and generate complete sets of fields rather than single generic inputs.
3.  **Result Construction:** A JSON object representing the form (IDs, labels, validation rules) is generated.

### 3.2 The Universal Code Generator
The `CodeGenerator` class (`src/components/ai-editor/codeGenerator.ts`) is a custom transpiler that:
*   **Inputs:** The JSON form definition.
*   **Configuration:** Target Framework (HTML, CSS+JS, React+TS+Tailwind, Next.js, Vue, Angular, Svelte, PHP).
*   **Outputs:** Complete, copy-paste ready source code strings.
    *   *React:* Automatically includes `zod` schema validation and `react-hook-form`.
    *   *Exports:* Fixed logic ensures correct code generation for all selected options, with a robust download mechanism.

### 3.3 Visual & User Experience
*   **Hero Section:** Enhanced with a `GridDistortion` background, a direct glow effect on the hero image (replacing the old drop shadow), and floating 3D cards (including an "Encryption" card) to emphasize security. Tech/Framework logos have been updated for accuracy.
*   **Workflow Section:** Optimized spacing to minimize negative space and improve the sticky stacking animation flow.
*   **Mobile Interactions:** Fixed touch event handling to ensure drag-and-drop and canvas interactions work seamlessly on mobile and tablet devices.
*   **Terminal Aesthetics:**
    *   **Terminal Popups:** "View Documentation" and footer links now trigger a custom, draggable Terminal window UI instead of simple redirects or alerts.
    *   **Donation Modal:** Redesigned with sharp corners and a technical look to align with the CLI aesthetic. Logic fixed to prevent blank screens during bank selection.

### 3.4 Drag and Drop Builder
A newly implemented Drag and Drop system allows users to explicitly construct forms:
*   **Sidebar:** draggable input types (Text, Email, Checkbox, etc.).
*   **Canvas:** A droppable area where users can place and reorder fields.
*   **Hybrid Workflow:** Users can start with an AI prompt and then refine the layout via manual drag-and-drop.

---

## 4. Design Philosophy
The application prioritizes **"Invisible Complexity"** and **"Premium Aesthetics"**.
*   **For the User:** It feels like magic. They type a sentence, and a fully functional form appears.
*   **Under the Hood:** Complex vector math, dependency injection, and AST-like code generation handle the heavy lifting.
*   **Aesthetics:** Dark mode first, utilizing vibrant accent colors (Blue/Purple/Pink gradients), glassmorphism, and smooth animations found in modern SaaS tools.

---

## 5. Future Scalability
The architecture is designed to expand:
*   **New Frameworks:** Adding support for *SolidJS* or *Qwik* is as simple as adding a method to the `CodeGenerator` class.
*   **Smarter AI:** The `knowledge.ts` file can be easily expanded with more templates without touching core logic.
*   **Cloud Sync:** Currently local-only, but the `Zustand` state can easily be serialized to a backend (Supabase/Firebase) for saving projects.
