# Design QA

final result: passed

## Source and implementation
- Source: /var/folders/xx/94jd6tq1383cdtfw8r0wdcsw0000gn/T/codex-clipboard-5075aa0a-1da9-4e94-a125-afa684fb0ebc.png
- Source size: 926 × 1698 pixels. It determines content, sequence and desktop grids, not the final colors or precise heights.
- Visual rules: DESIGN.md plus confirmed structure-to-theme mapping.
- Local implementation: http://127.0.0.1:5187/
- Desktop screenshot: docs/preview/desktop.jpg; normalized: docs/preview/desktop-normalized.jpg (927 × 2297).
- Combined comparison: docs/preview/comparison.jpg, source and implementation displayed at equal 650px width without vertical stretching.
- Desktop CSS viewport: 927 × 899; browser has fractional devicePixelRatio 0.737. Raw screenshot includes external white padding, removed from normalized copy only.
- Mobile CSS viewport: 391 × 844; screenshot docs/preview/mobile.jpg.
- State: homepage, pending article/course material, disabled unconfigured social entries.

## Comparison
Source and rendered page opened together in the combined comparison image. Module order, five sections, two experience groups, three article cards, two course cards, four nav items and five contact entries match. Colored backgrounds, pill navigation, rounded outlined cards and sculptural hero are intentional changes governed by DESIGN.md. Text comes from confirmed copy rather than generated source typos. No dates, teaching history, products, new CTA or fictional content added.

Full-page comparison text is sufficiently readable to verify hierarchy, group labels and row order; focused browser inspection also checked mobile display typography, keyboard outline, grid column counts and placeholder accessible names. Generated raster ribbon composited on pale blue; no UI shadow, blur or gradients used. Font fallback is explicit; named commercial fonts are not claimed to be loaded.

## Comparison history
- P2 mobile display line clipped at initial 64px minimum. Fixed with dedicated mobile tokens (36–52px clamp, 12vw fluid step). Post-fix browser measured 46.89px text and a right edge of 343.43px within 391px viewport; revised mobile capture inspected and no document overflow found.
- Initial screenshot normalization cut through the navigation pill. Corrected evidence normalization using an uninterrupted background row; this was screenshot padding, not a page defect.

## Interactions and validation
- About, articles, courses, contact anchors verified. Articles landing top within one CSS pixel; courses/contact remain visible when bottom-of-page scroll limits prevent aligning exactly to top.
- Keyboard navigation reaches anchors; focus outline visible.
- Hover/active styles provided for enabled nav and configured card links; disabled social buttons do not perform actions.
- Pending cards remain non-interactive until real href is supplied. No fabricated navigation targets.
- Desktop article grid: 3 columns; courses and experiences: 2 columns. Mobile grids: 1 column. No horizontal document overflow.
- npm run build passed (TypeScript + Vite).
- Browser console errors: none.

## Follow-up limits
- Real covers, article/course content and social targets are intentionally pending per user request.
- Chinese system fallback used; no final Chinese font file supplied.
- No backend, extra route, signup or QR modal introduced.

## Approved video hero update

final result: passed

- Scope: replace only the hero using the user-approved video/layout plan. Existing growth, article, course and contact structure retained.
- Evidence: docs/preview/hero-video-desktop.jpg (1920×1080 CSS viewport), hero-video-926.jpg (927px CSS width, approximately the 926px target), hero-video-mobile.jpg (389×844 CSS viewport, approximately the 390px target). Browser fractional zoom required calibrated viewport overrides; overrides reset after verification.
- Hero fills one visible viewport; video is absolute inside the section and does not remain behind subsequent content. No image assets are approximated. Existing local MP4 is used as explicitly selected by the user.
- Text: 30px static Chinese heading, existing role, 18–26px typed positioning, 24px English auxiliary line. Fonts and capsule navigation reuse existing tokens. Plain white translucent wash improves black text contrast; no gradients, blur or shadows.
- Desktop mouse drag test: video currentTime moved from 0 to 2.109549, then backward to 0.595082 while paused.
- Mobile: currentTime=0, one viewport hero, intro bottom 795.96 within 843.96 hero height (48px bottom clearance), header bottom145.50. No horizontal overflow at any tested width.
- Navigation: article/course top within one CSS pixel at mobile; contact visible; about returns to hero; keyboard Tab reaches navigation and solid focus outline is visible.
- Browser: completed full positioning text with no remaining cursor, video paused, no console errors.
- Isolated Hook verification: bidirectional seeks, single queued seek, min/max bounds, pointer reentry baseline, disabled scrubbing resetting to first frame, event cleanup, 600ms delay/38ms letter timing, timer cleanup and reduced-motion full text passed.
- Component error callback verification: selects video-failed class; fallback CSS hides video/wash and leaves pale-blue background, copy and nav intact. AutoPlay prop absent. Network failure and OS reduced-motion preference were not toggled in the live browser; their logic was verified in isolated checks.
- Build: npm run build passed.
- Remaining content/link placeholders are intentional and unchanged.

## Article directory and orbit update

final result: passed

- Approved source: user-supplied portfolio screenshot at /var/folders/xx/94jd6tq1383cdtfw8r0wdcsw0000gn/T/codex-clipboard-d74c611a-06b6-4b8c-8d98-866f776b4469.png and confirmed implementation plan. Source controls the list-plus-orbit behavior; existing DESIGN.md controls light surfaces, typography and electric-blue selection.
- Combined source/implementation evidence: docs/preview/articles-comparison.jpg. Local evidence: docs/preview/articles-desktop.jpg, with article-only crop docs/preview/articles-section.jpg. Desktop preview CSS width1280px; screenshot matches current visible article section. Broader desktop layouts also observed at1910px,2112px and927px; no horizontal overflow. Fractional browser zoom required viewport calibration. Temporary overrides reset.
- Composition: left title and indexed directory, right interactive orbital graph. Three entries and three placeholders only; sparse orbit is intentional pending real content. Source's brand, 50 works, black/yellow palette, social handle and labels not copied.
- Browser interactions: node01 click selects corresponding directory row; dragging from that node preserves selection instead of firing another click; Tab focuses row02 with solid outline and active state. Manual rotation changes node positions. No idle animation. Canvas uses touch-action: pan-y.
- Temporary fixture:12 entries, two categories, one working image and one invalid image. Directory scrolls internally. AI and design each filter to6 rows and matching6 nodes. Invalid image visibly falls back to labeled placeholder. Real link opened a new tab at /?verified=fixture#articles. Fixture files removed; delivered content remains3 placeholders and no category controls.
- Pure logic checks passed for categories/filtering, dynamic node count, unique IDs, perspective bounds at multiple rotations/sizes, depth sorting and frontmost hit testing.
- Existing reduced-motion global rule disables CSS transitions; orbit itself has no continuous motion. Manual dragging remains available. OS reduced-motion was not toggled in the browser.
- Cleanup reviewed: ResizeObserver, IntersectionObserver, RAF, image callbacks and pointer listeners cleaned up on unmount. Offscreen canvas cancels scheduled drawing.
- Mobile validation stopped at user's request. No mobile acceptance claim or mobile screenshot delivered.
- Build passed; production preview browser console has no errors. Course components remain unchanged. Initial hash navigation added so direct #articles links land at section after React mounts.

## Pointer fluid visual layer

final result: passed

- Reference: https://www.aaabadcode.com/, observed via in-app browser. Pointer interaction produced colored curled ink trails that disperse. Implementation applies the requested effect to the current website, without copying reference content.
- Implementation evidence: docs/preview/pointer-fluid.jpg. Transparent WebGL2 velocity/dye simulation uses existing electric-blue, violet, mint and lavender palette tokens. No CSS gradient, backdrop filter or shadow added.
- Initial alpha rendering produced dark fringe; corrected by normalizing dye hue before premultiplied-alpha display. Revised browser view shows translucent colored trails without dark fringe.
- Browser initialization: data-fluid-status=ready. Mouse movement/drag visibly generates ink trails; later idle view is clear. Overlay pointer-events=none.
- Existing article entry selection remains functional (aria-pressed=true); drag still rotates the orbit without changing that selection. Console errors: none.
- Lifecycle reviewed: idle stop and clear after4.5s, background-tab pause, pointer reentry and scroll baseline reset, resize reallocation, cleanup of events/RAF/GPU resources. Reduced-motion and coarse-pointer media gates disable effect; unsupported WebGL2 gracefully leaves page unchanged. Those media/fallback branches were inspected, not toggled in browser.
- Desktop validation only; no mobile checks added per user preference.
