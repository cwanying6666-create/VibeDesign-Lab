# Article archive QA

Source visual truth: `/var/folders/xx/94jd6tq1383cdtfw8r0wdcsw0000gn/T/codex-clipboard-2f388438-efbb-44d1-a719-2ae9560983c8.png` (3024 × 1452).

Implementation: `docs/preview/article-orbit-desktop.png` (1910 × 1074), localhost port 5187, articles section, list view, all nine articles selected. Reported CSS viewport 1910 × 1075; browser DPR 1.34. The capture backend returns a normalized screenshot; do not infer spacing from DPR alone.

Full-view comparison: `docs/preview/article-orbit-comparison.jpg`. Both images are proportionally resized to a 1000 px comparison column. This is a structural adaptation, not a pixel clone: the user explicitly requested the existing site's theme and folder content. Retained the existing section heading, navigation, fonts, white background and blue/purple tokens. Replaced the reference's 50 unrelated works with the nine real articles, their three categories, existing source icons, and verified existing Feishu hrefs. Orbital lines are an interactive data visualization, not a replacement for raster artwork.

## Findings and iteration history

- P2 (fixed): back-facing node text was too pale. Increased minimum node opacity from .55 to .78, preserving depth while improving readability.
- P2 (fixed): orbit occupied too little of its column compared with the reference. Increased desktop height to 480 px and adjusted radius to use the available height while constraining it by width. Final screenshot shows a balanced left archive/right constellation.
- No remaining actionable P0/P1/P2 findings in the requested desktop view.

## Required fidelity surfaces

- Typography: existing Source Han Sans CN and Inter retained. Existing section headline remains the primary heading; list titles wrap instead of clipping. Topic labels are secondary to article names.
- Spacing/layout: two columns, compact category filters, four visible ruled rows with internal scrolling for the remaining articles, aligned footer, right orbital panel and lower wordmark. Current counts intentionally produce less visual density than the 50-item reference.
- Colors: existing white surface, blue active filter, purple accents, category colors inherited from the folder content. Intentional departure from the black/yellow reference.
- Assets: existing collection icon PNGs reused in nodes; no invented article cover images or third-party content. Real links remain standard anchors.
- Copy: all nine titles and links originate from the folder collection data. Counts are derived from that same data.

## Validation

- Browser: file/list toggle exercised in both directions; existing folders restored successfully.
- Tools category: three list entries and three matching orbit nodes; counter 03 / 09. Returning to all restores nine.
- Pointer drag changes orbit orientation without opening an article. Native article anchors expose `_blank` and the correct Feishu URLs; navigation permissions remain those of the source documents.
- Hover/focus linkage provided for matching list and orbit entries.
- Reduced-motion preference disables automatic rotation.
- Narrow-layout DOM check: at reported CSS width 582 px, archive becomes a vertical flow and document scroll width equals viewport width. Mobile screenshot backend scaling did not yield a reliable viewport capture; no claim of a full physical-device visual test.
- Browser console error check: none captured.
- `npm run build`: passed.

Focused review used the full-resolution implementation capture to inspect filters, title wrapping, count, links and orbit labels; the side-by-side image establishes overall structural comparison.

## Follow-up polish

- Real article cover images can replace the existing category icons when provided.
- A physical phone touch test remains useful for the drag interaction.

final result: passed
