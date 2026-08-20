# User Taste Profile
- Prefers to grant the assistant broad permissions / "allow all" rather than being prompted for each action. Confidence: 0.8
- Demands honest status reporting — never overclaim verification, never fabricate results, and never suppress or weaken tests to make things pass. Confidence: 0.95
- Wants a clear separation between "code ready" and "infrastructure verified" — code-level implementation alone should not be marked as fully VERIFIED if the actual infrastructure hasn't been provisioned/tested. Confidence: 0.9
- Prefers exhaustive security reporting with full control matrices rather than sample subsets. Confidence: 0.85
- Expects a full regression loop (lint → typecheck → unit → E2E → security → audit → build) before declaring success, and if anything fails, root-cause → fix → retest → full regression. Confidence: 0.9
- Does not want tests deleted, weakened, or warnings suppressed to make things pass. Confidence: 0.9
- Prefers highly structured, numbered reports with explicit section headers, tables, and status labels (e.g., VERIFIED / PARTIAL / PENDING / BLOCKER). Confidence: 0.85
- Uses ALL CAPS for emphasis and section headers; expects the assistant to match this level of formality and precision. Confidence: 0.7
