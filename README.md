# DCS – Digital Commerce Solutions | Coaching Institute Website

A six-page, fully responsive website for **DCS (Digital Commerce Solutions)**, a coaching institute for **Class 11 and Class 12** students.

Built with plain **HTML5, CSS3 and vanilla JavaScript** – no frameworks, no build step.

---

## Pages

| File | Page | Main sections |
|---|---|---|
| `index.html` | Home | Hero, Why Choose DCS, Academic Programs, Teaching Approach, YouTube, CTA |
| `about.html` | About Us | Introduction, Vision, Mission, Core Values, Why DCS? |
| `courses.html` | Courses & Programs | Class 11 Foundation, Class 12 Board Program, Subjects, Learning Cycle |
| `faculty.html` | Our Faculty | Faculty profiles, Teaching Philosophy, Student Support |
| `achievements.html` | Results & Achievements | Animated counters, Student results, Testimonials, Gallery + lightbox |
| `contact.html` | Contact Us & Admission Enquiry | Contact details, Enquiry form with validation, Map, FAQ |

## Features

- Sticky navigation bar with active-page highlighting
- Hamburger menu on tablets and phones
- Smooth scrolling and a back-to-top button
- Scroll-reveal animations (disabled automatically for users who prefer reduced motion)
- Animated achievement counters
- Expandable / collapsible FAQ section
- Image gallery with lightbox (click, arrow keys, Esc to close)
- Admission enquiry form with JavaScript validation (required fields, email format, 10-digit Indian mobile number) and success / error messages
- Same header, footer and orange-and-black branding on every page

## Folder structure

```
DCS-Website/
├── index.html
├── about.html
├── courses.html
├── faculty.html
├── achievements.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
│   ├── dcs-logo.png          ← original logo (unchanged)
│   ├── dcs-logo-wide.png     ← same logo, empty margin trimmed for the navbar/footer
│   ├── favicon.png
│   ├── hero-image.jpg
│   ├── about-classroom.jpg
│   ├── faculty/
│   ├── students/
│   └── gallery/
└── README.md
```

## How to run

**Locally:** download / unzip the folder and double-click `index.html`. It opens in any modern browser; no server or installation is needed. (An internet connection loads the Poppins and Inter fonts; without one, the site falls back to system fonts.)

**On GitHub Pages:**
1. Create a new GitHub repository and upload the *contents* of `DCS-Website/` (so `index.html` is at the root).
2. Go to **Settings → Pages**.
3. Under *Build and deployment*, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
4. After a minute the site will be live at `https://<your-username>.github.io/<repository-name>/`.

All paths are relative, so the site works both locally and on GitHub Pages.

---

## Content still to be supplied (placeholders)

Placeholders are shown on the site in **orange brackets**, e.g. `[Insert Institute Address]`. Search the HTML files for `class="ph"` to find them all.

| Item | Where | What to do |
|---|---|---|
| Institute address | footer (all pages), `contact.html` | Replace `[Insert Institute Address]` |
| Working hours / batch timings | footer, `contact.html`, `courses.html` | Replace `[Insert Timings]` |
| Teaching mode | `courses.html` | Replace `[Confirm offline / online]` |
| Subjects | `courses.html` → *Subjects* | Only **Accountancy** is marked *Offered*. For each confirmed subject, change `badge--outline">To be confirmed` to `badge--orange">Offered` and remove the `is-tbc` class from the card. Remove cards for subjects that are not offered (and from the form's subject list in `contact.html`). |
| Faculty details | `faculty.html` | Replace names, designations, qualifications, experience and introductions. Put photos in `images/faculty/` and update each `<img src>`. |
| Achievement statistics | `achievements.html` | The four counters use **sample values**. Edit `data-target="..."` on each `.stat__value` and remove the "Sample figures" notice. |
| Student results | `achievements.html` | Replace sample cards (name, class, `XX%`, description). Put photos in `images/students/`. Remove the `<span class="sample-ribbon">` once the results are real. |
| Testimonials | `achievements.html` | Add genuine feedback only. Star ratings may be added for genuine testimonials (an example is in the HTML comments). |
| Gallery photos | `images/gallery/` | Replace the six placeholder images with real photos using the **same file names**, or update the paths in `achievements.html`. Recommended size: 1200 × 800 px. |
| Instagram / Facebook links | footer + `contact.html` (generated in every page) | Replace `href="#"` with the real profile URL and remove `class="is-placeholder"`. YouTube and WhatsApp are already linked. |
| Google Map | `contact.html` → *Find Us* | Follow the instructions in the HTML comment to paste the Google Maps embed `<iframe>`. |

Information already filled in: institute name, phone number (+91 98976 47392), email, the YouTube channel, and Dr Amit Ruhela as the Accountancy faculty member.

## Connecting the enquiry form

The enquiry form is a **demonstration**: it validates the input and shows a success message, but **does not store or send** enquiries (this is stated on the page). To receive enquiries by email, connect a free form service such as [Formspree](https://formspree.io):

1. Create a form on Formspree and copy its endpoint (e.g. `https://formspree.io/f/abcdwxyz`).
2. In `js/script.js`, find the comment `// Demonstration submission` and replace the `setTimeout(...)` block with a `fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })` call, then show `#form-success` when the response is OK.
3. Update the success message text in `contact.html` so it no longer says the form is a demo.

## Brand colours

| Name | Hex |
|---|---|
| Primary Orange | `#FF5A00` |
| Deep Black | `#080808` |
| Secondary Black | `#151515` |
| Pure White | `#FFFFFF` |
| Light Grey | `#F4F4F4` |
| Medium Grey | `#777777` |

These are defined once as CSS variables at the top of `css/style.css`.

## Credits

- Fonts: [Poppins](https://fonts.google.com/specimen/Poppins) and [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts, Open Font License)
- Icons: inline SVGs in the style of [Lucide](https://lucide.dev) (ISC License)
- Illustrations and placeholder images: created for this project

© Digital Commerce Solutions (DCS). All rights reserved.
