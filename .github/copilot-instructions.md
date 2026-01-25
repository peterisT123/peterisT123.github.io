# Copilot Instructions for studio-apdrosinFirebase

## Project Overview
- This is a Next.js (TypeScript) app for insurance workflows, using Firebase App Hosting and Genkit for AI integration.
- The main user flow is a multi-step insurance application, managed via React context and stepper components.
- The UI is built with Radix UI, Tailwind CSS, and custom utility functions.

## Key Architecture
- **App State:** Centralized in `src/context/app-context.tsx` using React context. All step components and forms interact with this context.
- **Steps:** Each step in the insurance flow is a component in `src/components/steps/` (e.g., `intro-step.tsx`, `property-details-step.tsx`).
- **Stepper:** The visual stepper is in `src/components/stepper.tsx`.
- **Types & Validation:** Types are defined in `src/lib/types.ts` and validated with Zod schemas in `src/lib/schema.ts`.
- **AI Integration:** Genkit is configured in `src/ai/genkit.ts` and used for Google Gemini model integration. AI flows are imported for side effects in `src/ai/dev.ts`.
- **Placeholder Images:** Managed in `src/lib/placeholder-images.json` and imported via `src/lib/placeholder-images.ts`.

## Developer Workflows
- **Start Dev Server:** `npm run dev` (Next.js on port 9002)
- **Start Genkit AI Dev:** `npm run genkit:dev` or `npm run genkit:watch`
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Typecheck:** `npm run typecheck`

## Project Conventions
- Use absolute imports with `@/` prefix (see `tsconfig.json`).
- All state changes for the insurance flow should go through the context in `app-context.tsx`.
- UI components are colocated in `src/components/ui/` and follow Radix UI patterns.
- Zod is used for all form validation; see `schema.ts` for rules and error messages (in Latvian).
- Images for UI are referenced by ID from the placeholder images JSON.
- TypeScript strictness is relaxed for build (see `next.config.ts`).

## External Integrations
- **Firebase App Hosting:** Configured via `apphosting.yaml`.
- **Genkit/Google Gemini:** See `src/ai/genkit.ts` for model setup.

## Example Patterns
- To add a new step, create a component in `src/components/steps/` and update the stepper logic/context.
- To add new validation, extend Zod schemas in `schema.ts` and update types in `types.ts`.

## References
- Main entry: `src/app/page.tsx`
- App context: `src/context/app-context.tsx`
- Stepper: `src/components/stepper.tsx`
- Types: `src/lib/types.ts`, `src/lib/schema.ts`
- AI: `src/ai/genkit.ts`, `src/ai/dev.ts`

---
For questions about project-specific patterns, review the referenced files above for concrete examples.
