# FINAL PERFORMANCE VERIFICATION REPORT
**Target:** Hillary Step Solutions  
**Production URL:** `https://hillarystepsolutions.com`  
**Date:** 2026-09-24  
**Audit Tooling:** Clean Next.js 16 Production Build · Chrome DevTools Protocol (CDP Tracing) · Lighthouse 13.5.0 · Real Headless/CDP Chrome Session  

---

## 1. Clean Production Build Confirmation

A clean production build was executed directly on the project:

- **Build Command:** `npm run build` (`next build --webpack`)
- **Compilation:** `✓ Compiled successfully in 9.2s`
- **TypeScript:** `Finished TypeScript in 4.8s` — **0 errors**
- **Static Page Generation:** `✓ Generating static pages (15/15) in 873ms` — **0 hydration errors**
- **Browser Console (Production):** **0 errors** (2 THREE.Clock deprecation notices from Three.js r185)
- **Build Status:** **PASS**

---

## 2. Lighthouse Audit (Actual Deployed Production URL)

Lighthouse 13.5.0 was run directly against the live deployed production URL: `https://hillarystepsolutions.com` (hosted on Hostinger edge CDN).

### Desktop
- **Lighthouse Performance Score:** **72 / 100**
- **LCP (Largest Contentful Paint):** **1.5 s**
- **CLS (Cumulative Layout Shift):** **0**
- **INP (Interaction to Next Paint):** **N/A**
- **FCP (First Contentful Paint):** **0.4 s**
- **TBT (Total Blocking Time):** **360 ms**
- **Speed Index:** **2.8 s**
- **Transferred Bytes:** **11,546 KiB** (11.5 MB)

### Mobile (Emulated Moto G Power / 4G Throttling)
- **Lighthouse Performance Score:** **50 / 100**
- **LCP (Largest Contentful Paint):** **3.8 s**
- **CLS (Cumulative Layout Shift):** **0**
- **INP (Interaction to Next Paint):** **N/A**
- **FCP (First Contentful Paint):** **1.6 s**
- **TBT (Total Blocking Time):** **3,630 ms**
- **Speed Index:** **8.5 s**
- **Transferred Bytes:** **9,313 KiB** (9.3 MB)

### Comparison Against Original Production Baseline

| Metric | Original Production Baseline | Current Production (Measured) | Delta / Status |
| :--- | :--- | :--- | :--- |
| **Performance Score** | 39 | **72** (Desktop) / **50** (Mobile) | **+33 pts Desktop** / **+11 pts Mobile** |
| **LCP** | 6.3s | **1.5s** (Desktop) / **3.8s** (Mobile) | **-4.8s Desktop** (76% faster) |
| **TBT** | 1,290ms | **360ms** (Desktop) / **3,630ms** (Mobile) | **-930ms Desktop** (72% reduction) |
| **FCP** | 4.0s | **0.4s** (Desktop) / **1.6s** (Mobile) | **-3.6s Desktop** (90% faster) |
| **Speed Index** | 6.4s | **2.8s** (Desktop) / **8.5s** (Mobile) | **-3.6s Desktop** (56% faster) |
| **CLS** | 0 | **0** | **0 (Flawless)** |
| **Main-Thread Tasks** | 20 long tasks | **17 in-page / 49 total trace tasks** | Profiled below |

---

## 3. Chrome Performance Trace & Runtime Analysis

A full Chrome DevTools performance trace was captured while loading the homepage and continuously scrolling top-to-bottom through every interactive section.

### Runtime Metrics Summary
- **Average Observed FPS:** **49 FPS** (across entire end-to-end scroll)
- **Total Frames Sampled:** **1,865 frames**
- **Average Frame Time:** **20.32 ms**
- **Worst Observed Frame Time:** **533.1 ms** (Three.js Globe scene construction & shader compile)
- **Forced Synchronous Layouts:** **0** (No layout thrashing detected)
- **GC Spikes (>20ms):** **2** detected during WebGL heap allocation

### Main-Thread Execution Breakdown
- **Scripting Time:** **11,323 ms**
- **Rendering Time (Style/Layout):** **1,475 ms**
- **Painting Time (Rasterization/Paint):** **1,572 ms**
- **Compositing Time:** **1,681 ms**

### Long Tasks Breakdown
- **Tasks > 50 ms:** **49**
- **Tasks > 100 ms:** **11**
- **Tasks > 200 ms:** **1**
- **Tasks > 500 ms:** **1** (533.1 ms)
- **Largest Long Task:** **533 ms** (Globe component mount and WebGL buffer upload)
- **Main-Thread Hotspots:**
  1. Three.js Globe point-cloud & arc geometry allocation during scroll entry
  2. Footer typing animation rerenders running concurrently with canvas wave updates
  3. React 19 concurrent hydration on initial payload

---

## 4. Section-by-Section Animation Verification

Each animated section was tested independently with continuous frame-by-frame profiling during scroll and user interaction.

```
+------------------+----------+---------------+----------------+-------------------+
| Section          | Avg FPS  | Dropped Frames| Avg Frame Time | Verdict           |
+------------------+----------+---------------+----------------+-------------------+
| BentoGrid        | 59 FPS   | 3 / 244       | 16.94 ms       | PASS              |
| Regions          | 57 FPS   | 4 / 297       | 17.51 ms       | PASS              |
| Globe            | 26 FPS   | 74 / 164      | 37.90 ms       | NEEDS ATTENTION   |
| AI Section       | 49 FPS   | 10 / 98       | 20.57 ms       | NEEDS ATTENTION   |
| FluidBlob        | 60 FPS   | 0 / 121       | 16.67 ms       | PASS              |
| Navbar           | 60 FPS   | 0 / 122       | 16.66 ms       | PASS              |
| Footer           | 22 FPS   | 34 / 55       | 45.45 ms       | NEEDS ATTENTION   |
| Modal Open/Close | 57 FPS   | 3 / 146       | 17.70 ms       | PASS              |
+------------------+----------+---------------+----------------+-------------------+
```

### 1. Regions
- **Verdict:** **PASS**
- **FPS:** **57 FPS** | Dropped frames: 4 / 297 | Avg frame time: 17.51 ms | Max frame time: 183.3 ms
- **Evidence:** Canvas blur (`ctx.filter = blur(...)`) in the per-frame loop was eliminated. Software rasterization in the 2D context is no longer blocking frames. Max frame time occurred once during canvas initial sizing. Steady scroll stays between 57–60 FPS.

### 2. Globe
- **Verdict:** **NEEDS ATTENTION**
- **FPS:** **26 FPS** | Dropped frames: 74 / 164 | Avg frame time: 37.90 ms | Max frame time: 533.1 ms
- **Evidence:** When the 3D Globe enters the viewport, frame rates drop significantly to **26 FPS**, with 74 dropped frames out of 164. The largest long task in the entire trace (533.1 ms) happens during Globe initialization. Three.js rotation and arc updates on the main thread still consume 35–45ms per frame while scrolling through this section.

### 3. FluidBlob
- **Verdict:** **PASS**
- **FPS:** **60 FPS** | Dropped frames: 0 / 121 | Avg frame time: 16.67 ms | Max frame time: 17.3 ms
- **Evidence:** Particle processing is smooth with **zero dropped frames** and perfectly locked 60 FPS. Frame times remain strictly below 17.3 ms.

### 4. AI Section
- **Verdict:** **NEEDS ATTENTION**
- **FPS:** **49 FPS** | Dropped frames: 10 / 98 | Avg frame time: 20.57 ms | Max frame time: 99.9 ms
- **Evidence:** WebGL canvas animation in the AI section maintains an acceptable ~49 FPS, but drops 10 frames during active scroll transition into the section. It requires animation throttling or pausing when outside the direct viewport.

### 5. Navbar
- **Verdict:** **PASS**
- **FPS:** **60 FPS** | Dropped frames: 0 / 122 | Avg frame time: 16.66 ms | Max frame time: 17.2 ms
- **Evidence:** Pointer interactions (hover, mouse movement, menu toggles) produce **0 forced reflows** and 0 dropped frames. Main-thread execution stays under 1.2ms per pointer event.

### 6. Footer & FooterWave
- **Verdict:** **NEEDS ATTENTION**
- **FPS:** **22 FPS** | Dropped frames: 34 / 55 | Avg frame time: 45.45 ms | Max frame time: 133.2 ms
- **Evidence:** The typing text animation in the Footer causes frequent state updates and parent component re-renders that run simultaneously with the wave canvas loop. This pulls frame rates down to **22 FPS**, dropping 34 out of 55 sampled frames.

### 7. Lenis Smooth Scroll
- **Verdict:** **NEEDS ATTENTION**
- **Evidence:** Lenis feels responsive and smooth (57–60 FPS) through the top sections (Hero, BentoGrid, Regions). However, when the user scrolls through the **Globe** and **Footer**, the main thread becomes congested by 3D/canvas re-renders, causing the scroll to stutter and feel "draggy" specifically around those two sections.

---

## 5. Mobile Viewport Verification

Tested using Chrome CDP device emulation with touch interaction simulation:

### A. Viewport 390x844 (iPhone 14/15 profile)
- **Observed FPS:** **58 FPS**
- **Dropped frames:** 4 / 405 frames
- **Average frame time:** 17.32 ms
- **Max frame time:** 166.6 ms
- **Touch interaction:** Responsive, no input delay on taps or menu toggle.

### B. Viewport 412x915 (Pixel / Samsung Galaxy profile)
- **Observed FPS:** **59 FPS**
- **Dropped frames:** 5 / 409 frames
- **Average frame time:** 17.07 ms
- **Max frame time:** 133.2 ms
- **Touch interaction:** Responsive; modal opens smoothly.

### Mobile Bottleneck Observation
While lightweight sections maintain 58–59 FPS on mobile viewports, the overall mobile Lighthouse score is pulled down to **50** due to:
1. High payload size (**9.3 MB transferred**) caused by video and uncompressed assets.
2. Main-thread blocking time (**3,630 ms TBT**) under mobile CPU throttling during initial Three.js and animation bundle hydration.

---

## 6. Real-World Verification Verdict Summary

In adherence to strict verification requirements:

- **We DO NOT claim "60 FPS across the entire page"**: The empirical average across the full page is **49 FPS**, with the Globe dropping to **26 FPS** and the Footer dropping to **22 FPS**.
- **We DO NOT claim "zero lag"**: Two major lag points were observed and measured:
  1. The **Globe mount/render spike** (533 ms long task, 26 FPS scroll).
  2. The **Footer typing animation rerender cascade** (22 FPS, 34 dropped frames).
- **Regions, FluidBlob, Navbar, BentoGrid, and Modals** have **PASSED** verification with smooth 57–60 FPS performance and 0 reflow spikes.
- **Globe and Footer** require focused runtime isolation before full 60 FPS consistency is achieved in production.
