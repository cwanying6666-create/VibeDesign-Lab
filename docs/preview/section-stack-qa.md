# Section Scroll Stack — 2026-10-19

Source: https://github.com/DavidHDev/react-bits/tree/main/src/ts-default/Components/ScrollStack
License retained in `src/components/react-bits/LICENSE.md`.

## Implementation

- `SectionStack.tsx` wraps the personal introduction, article collections and course section, in that order.
- Official Scroll Stack runs in window-scroll mode with smoothing and snapping disabled. There is one native page scrollbar.
- Articles form a white card with 40px desktop / 28px narrow-screen top corners and a subtle upper shadow.
- The introduction recedes to 97% with at most 6% dark overlay as articles cover it.
- Header height is observed for the sticky offset. Cards retain natural content height and at least the available screen height.
- Local upstream adaptation computes each sticky top as the smaller of the normal pin offset and viewport height minus card height. Tall cards can therefore be read to their bottom.
- Reduced-motion mode removes sticky stacking, scaling and dimming; preference changes also schedule an update.

## Validation

- `npm run build`: passed. Existing large-bundle warnings remain.
- Desktop browser: introduction stayed at 99px while the next card rose to 271px. Introduction measured scale 0.9753 and shade 0.050.
- Reverse scroll reduced the shade to 0.030 and restored scale to 0.9852.
- Navigation links to introduction, articles and courses work. Folder buttons still open inside the stacked section.
- Narrow-screen layout: all three folders remain in one naturally tall article section (1734px measured); the last folder opens, and its caption remains before the article/course boundary. The browser viewport emulation reported approximately 560 CSS pixels instead of the requested 390, so an exact 390px device test is not claimed.
- No browser console errors observed.
- Reduced-motion fallback was inspected in code; an OS-level preference toggle was not performed.

Screenshot: `section-stack-desktop.png`.

## Course extension

- Course is the third stack card, using the existing pale purple background, the same top corners and shadow as the articles card.
- Desktop verified the article slot stayed at 99px as the course rose to 507px; article scale was 0.9817 with 0.037 shade opacity.
- `查看课程` still opens the full printout and moves focus to it. Contact remains after the three-card stack.
- Build passed; no browser console errors observed. Screenshot: `course-stack-desktop.png`.
