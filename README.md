# Erfan Moghadam — Portfolio V4 Refined

This version focuses on academic polish and performance.

## Main design changes
- Smaller, more professional typography.
- Hero name uses clean sans-serif typography.
- Section headings use a restrained academic serif.
- Experience is now a card-based vertical timeline.
- Education is now presented as clean academic cards.
- Original light/dark palette is preserved.
- 3D connected-mobility identity is preserved but visually quieter.

## Performance changes
- GSAP removed.
- Native IntersectionObserver reveal animations.
- Only one WebGL renderer.
- Hero 3D animation pauses when the hero is off-screen or the tab is hidden.
- Fewer nodes/particles and lower pixel ratio.
- Network nodes and packets use Points instead of many individual meshes.
- Contact section uses CSS rather than a second Three.js animation loop.

## Run
```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

Replace placeholder links, email, CV, and portrait before publishing.


## Customized version changes
- Stronger black text in light mode for readability.
- Larger header typography and removed "Research Portfolio" subtitle.
- Main Hero CTA changed to Download CV.
- Larger profile links + ResearchGate.
- Always-on translucent white glass header in light mode.
- Smaller section headings.
- Teaching merged into Experience.
- Added Honors & Awards.
- Added editable Gallery section for photos + captions.

### CV
Place your CV at:
`files/Erfan-Moghadam-CV.pdf`

### Gallery
Place gallery images in:
`assets/images/`

Then replace the gallery placeholder `<div>` blocks in `index.html`
with `<img class="gallery-image" ...>` tags as documented in the HTML comments.


## Sam-inspired typography refinement
- Display font: Fraunces
- Body/UI font: Plus Jakarta Sans
- Hero name and supporting text reduced in size
- Hero center made whiter with a smooth fade toward pale blue


## Academic Profile Layout Update
- Combined About + Research into one Academic Profile section.
- Removed standalone Research section and Research navigation item.
- Added right-column Research Interests cards.
- Header now keeps the name at the far left and navigation/actions to the right.
- Active navigation underline uses a mirrored reflective gradient instead of a flat blue line.
- Renumbered the remaining sections after removing standalone Research.


## Final polish update
- Header identity/navigation moved closer to viewport edges.
- Mirrored active navigation underline kept, but animation disabled.
- Dark-mode secondary text made lighter for readability.
- Experience timeline rail now has a subtle moving reflective highlight.
- Publications redesigned into polished academic cards with venue, status, year, summary, and actions.
