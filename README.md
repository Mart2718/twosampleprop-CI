# Two-Sample Interval Lab

**STAT C1000 · Santa Ana College · v1.4**
Live site: `https://sac-two-sample-ci.netlify.app`

An interactive lab that helps students choose, run, and interpret **2-Proportion Z-Intervals** and **2-Sample T-Intervals**. Students do the calculations in Art of Stat; the lab checks their answers and builds their interpretation.

## What students do

| Step | What happens |
|---|---|
| **1 · Choose the procedure** | 12 scenarios (6 Core, 6 HOT). Students answer two clues (the type of variable and the number of groups), and the 2×2 chart points to the procedure. Five of the scenarios are one-sample distractors. |
| **2 · Art of Stat how-to** | Click-by-click steps for Compare Two Proportions (Number of Successes, Wald) and Compare Two Means (Summary Statistics, equal variances unchecked). Includes the videos, an explanation of group order, the formulas, and an optional link to hypothesis tests. |
| **3 · Compute & interpret** | 6 problems with summarized data. Each one walks students through choosing the app, checking conditions, choosing 90/95/99%, running it in Art of Stat, entering the bounds, interpreting the result, and comparing levels. Students predict wider or narrower before switching levels. |

When an answer is wrong, the feedback names the likely mistake: groups entered in reverse order, the wrong confidence level, the wrong method, or rounding. **Teacher** mode shows answer keys. **Class mode** enlarges the text for projecting.

## Repo contents

```
index.html          ← the whole app (HTML, CSS, and JS in one file). This is what Netlify serves.
README.md           ← this file
CHANGELOG.md        ← version history
netlify.toml        ← publish the repo root, no build step
package.json        ← test scripts only (the app itself has no dependencies)
tests/
  stats-check.js    ← checks all 18 intervals against SciPy reference values
  click-through.js  ← answers every scenario and problem, including common mistakes
  accessibility.js  ← runs axe (WCAG 2.1 AA, including contrast) in Chromium, plus a phone-width check
```

## Embed in Canvas

```html
<iframe src="https://sac-two-sample-ci.netlify.app" title="Two-Sample Interval Lab"
  width="100%" height="1100" style="border:0" allow="clipboard-write"></iframe>
```
`allow="clipboard-write"` lets the Copy buttons work inside Canvas. Art of Stat and the YouTube links open in new tabs.

## Editing content

All of the content is in the `CONFIG` and `DATA` blocks near the top of the `<script>` in `index.html`.

| To change… | Edit |
|---|---|
| App or video links | `LINKS`, `VIDEOS` |
| Step 1 scenarios | `SCEN` (each needs `v: 'cat'|'quant'`, `g: 1|2`, and the clue text `cv` and `cg`) |
| Step 3 problems | `PROBS` (proportions use `x1,n1,x2,n2`; means use `m1,s1,n1,m2,s2,n2`; `tol` is the accepted error on each bound) |
| Art of Stat steps | The Step 2 cards in the HTML, plus `aosCard()` for the Step 3 inputs card |

If you change or add a problem, add its SciPy values to `REF` in `tests/stats-check.js`, or ask Claude to recompute them.

## Run the checks (optional, needs Node 18+)

```bash
npm install
npm test                                        # math + click-through
npx playwright install chromium && npm run test:a11y   # accessibility
```

## Deploy

**First time:** create the GitHub repo `sac-two-sample-ci`, upload these files, connect Netlify to the repo, and set the site name to `sac-two-sample-ci`.

**Updates:** edit `index.html`, add a line to `CHANGELOG.md`, then run:
```bash
git add . && git commit -m "v1.5 – description" && git push
```
Netlify redeploys automatically.

## Design and accessibility notes

- Santa Ana College palette: red `#c8102e`, black, grey, and white. Every text pair meets WCAG AA. SAC red appears as text only on light backgrounds (5.9:1).
- Activity zones are marked by shape and a label, not color alone. **Your turn** has black markers, **In Art of Stat** has a red edge, **How it works** is a grey panel, and **Teacher only** has a dashed outline.
- Feedback uses ✓/✗, a solid or dashed border, and words. Red is never used to mean "wrong."
- Keyboard: there's a skip link, the step tabs work with the arrow keys and Home/End, focus is always visible, and scrolling tables can be reached with Tab. Feedback is announced to screen readers.
- Math: proportions use the Wald interval and means use the Welch interval (unpooled, with decimal df), which matches Art of Stat with the settings above.

Built for Santa Ana College.
