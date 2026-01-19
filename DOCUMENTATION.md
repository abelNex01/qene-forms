# Qene Forms - Project Documentation

## 1. Executive Summary
**Qene Forms** is a modern, client-side web application designed to simplify how developers create web forms. Using an intuitive drag-and-drop interface, developers can visually build complex, validated, and styled forms without writing repetitive boilerplate code.

Unlike traditional form builders, Qene Forms generates production-ready code for multiple frameworks (React, Vue, Svelte, Angular, etc.) with a single click. The application features a professional "Terminal/CLI" aesthetic, excellent mobile responsiveness, and a fully modularized editor architecture.

---

## 2. Technical Architecture

### 2.1 Core Stack
The application is built on a cutting-edge frontend stack, ensuring high performance and a premium developer experience.
*   **Framework:** React 19 (Latest) with TypeScript.
*   **Build Tool:** Vite 7 (Exceedingly fast HMR and build).
*   **Styling:** Tailwind CSS 4 (Atomic CSS engine) + Shadcn/UI (Radix Primitives).
*   **Routing:** `wouter` (Minimalist, modern routing).
*   **State Management:** Zustand (Lightweight global state).
*   **Animations:** Framer Motion & GSAP (Complex interactions).
*   **3D Graphics:** React Three Fiber / Drei (Interactive hero elements).

### 2.2 Form Builder Engine
The core of the application is a visual form builder with the following capabilities:
*   **Drag & Drop Interface:** Users can drag field types from the sidebar onto the canvas.
*   **Field Configuration:** Each field can be customized with labels, placeholders, validation rules, and conditional logic.
*   **Real-time Preview:** Forms are rendered in real-time as users build them.
*   **Universal Export:** Forms can be exported as clean, production-ready code.

### 2.3 Project Structure
The codebase is organized for modularity and maintainability:
```
src/
├── components/
│   ├── ai-editor/      # The Core Form Builder Workspace (Modularized)
│   │   ├── Canvas.tsx          # Droppable area for form fields
│   │   ├── SidebarLeft.tsx     # Field type palette, drag source
│   │   ├── SidebarRight.tsx    # Field property editors
│   │   ├── Header.tsx          # Editor controls & status
│   │   ├── ExportModal.tsx     # Code export interface
│   │   ├── PreviewModal.tsx    # Live form preview
│   │   ├── CodeModal.tsx       # Generated code viewer
│   │   ├── useAIEditor.ts      # Core state management hook
│   │   ├── constants.ts        # Field types and validation rules
│   │   └── codeGenerator.ts    # Transpiler: Fields -> Source Code
│   ├── home/           # Landing Page (Hero, Features, Integrations, etc.)
│   └── ui/             # Reusable UI components (TerminalPopup, etc.)
├── pages/              # Route views (Home, Dashboard)
└── lib/                # Utilities and shared configurations
```

---

## 3. Core Features & Logic Deep Dive

### 3.1 The Form Building Flow
When a user builds a form in the dashboard:
1.  **Add Fields:** Click or drag field types from the left sidebar onto the canvas.
2.  **Configure Fields:** Select a field to customize its label, placeholder, validation, and conditional visibility.
3.  **Reorder Fields:** Drag fields within the canvas to reorder them.
4.  **Export:** Generate production-ready code for the target framework.

### 3.2 The Universal Code Generator
The `CodeGenerator` class (`src/components/ai-editor/codeGenerator.ts`) is a custom transpiler that:
*   **Inputs:** The JSON form definition (array of field objects).
*   **Configuration:** Target Framework (HTML, CSS+JS, React+TS+Tailwind, Next.js, Vue, Angular, Svelte, PHP).
*   **Outputs:** Complete, copy-paste ready source code strings.
    *   *React:* Automatically includes `zod` schema validation and `react-hook-form`.
    *   *Exports:* Clean, properly formatted code for all selected options.

### 3.3 Field Types
The form builder supports the following field types:
*   **Text Input** - Standard text field
*   **Text Area** - Multi-line text input
*   **Number** - Numeric input with min/max support
*   **Email** - Email input with validation
*   **Password** - Secure password input
*   **Phone** - Phone number input
*   **URL** - URL input with validation
*   **Dropdown/Select** - Single selection from options
*   **Checkbox** - Boolean toggle
*   **Radio Buttons** - Single selection from visible options
*   **Date/Time** - Date and time pickers
*   **File Upload** - File input with accept filter
*   **Rating** - Star rating input
*   **Toggle** - Switch/toggle input

### 3.4 Visual & User Experience
*   **Hero Section:** Features a floating image with decorative cards showing build status.
*   **Terminal Aesthetics:** "View Documentation" and footer links trigger custom, draggable Terminal window UI.
*   **Mobile Interactions:** Touch event handling ensures drag-and-drop works on mobile and tablet devices.
*   **Dark Mode First:** Clean, developer-focused UI with vibrant accent colors.

---

## 4. Design Philosophy
The application prioritizes **"Simplicity through Visual Design"** and **"Premium Aesthetics"**.
*   **For the User:** An intuitive, visual interface that makes form building feel natural.
*   **Under the Hood:** Clean component architecture and proper code generation for production use.
*   **Aesthetics:** Dark mode first, utilizing vibrant accent colors (Blue/Purple/Pink gradients), glassmorphism, and smooth animations.

---

## 5. Future Scalability
The architecture is designed to expand:
*   **New Frameworks:** Adding support for *SolidJS* or *Qwik* is as simple as adding a method to the `CodeGenerator` class.
*   **More Field Types:** New field types can be added to the `constants.ts` file with corresponding preview and export logic.
*   **Cloud Sync:** Currently local-only, but the `Zustand` state can easily be serialized to a backend (Supabase/Firebase) for saving projects.
*   **Templates:** Pre-built form templates for common use cases (registration, contact, surveys).
