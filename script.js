/* ============================================================
   PORTFOLIO ENGINE — reads content.js and renders the page.
   DO NOT EDIT unless you know what you are doing.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  const data = window.portfolioData;

  if (!data) {
    console.error("Portfolio content could not be loaded. Check content.js.");
    return;
  }

  /* ---------- Helpers ---------- */
  const escapeHTML = (value = "") =>
    String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);

  const safeURL = (url = "") => {
    const value = String(url).trim();
    if (/^(https?:\/\/|mailto:)/i.test(value)) return value;
    if (/^(images|documents)\//i.test(value)) return value;
    return "";
  };

  const renderTags = (items = []) =>
    items.map(item => `<span class="tag">${escapeHTML(item)}</span>`).join("");

  const renderEmpty = msg =>
    `<p class="empty-message">${escapeHTML(msg)}</p>`;
     /* ---------- Evidence helpers (single string OR array) ---------- */
  const normalizeEvidence = (e) => {
    if (!e) return [];
    if (Array.isArray(e)) return e.map(x => String(x || "").trim()).filter(Boolean);
    if (typeof e === "string" && e.trim()) return [e.trim()];
    return [];
  };

  const isImageFile = (url) => /\.(jpe?g|png|webp|gif|avif|bmp)$/i.test(url);

  const renderEvidence = (evidence) => {
    const items = normalizeEvidence(evidence).map(safeURL).filter(Boolean);
    if (!items.length) return "";

    const tiles = items.map((url, i) => {
      if (isImageFile(url)) {
        return `<a href="${escapeHTML(url)}" target="_blank"
                   rel="noopener noreferrer" class="evidence-thumb"
                   title="Open evidence ${i + 1}">
                  <img src="${escapeHTML(url)}" alt="Evidence ${i + 1}" loading="lazy">
                </a>`;
      }
      return `<a href="${escapeHTML(url)}" target="_blank"
                 rel="noopener noreferrer" class="evidence-link">📄 Evidence ${i + 1}</a>`;
    }).join("");

    return `<div class="evidence-gallery">${tiles}</div>`;
  };

  /* ---------- HERO ---------- */
  document.getElementById("heroName").textContent = data.hero.name;
  document.getElementById("heroTitle").textContent = data.hero.title;
  document.getElementById("heroIntro").textContent = data.hero.intro;
  document.getElementById("heroLocation").textContent = data.hero.location;
  document.getElementById("heroTags").innerHTML = renderTags(data.hero.tags);
  document.title = `${data.hero.name} | Engineering & Research Portfolio`;

  /* ---------- ABOUT ---------- */
  document.getElementById("aboutText").innerHTML =
    (data.about || []).map(p => `<p>${escapeHTML(p)}</p>`).join("");

  /* ---------- EDUCATION ---------- */
  document.getElementById("educationList").innerHTML =
    (data.education || []).map(item => `
      <div class="education-item">
        <strong>${escapeHTML(item.degree)}</strong>
        <span>${escapeHTML(item.institution)}</span>
       <p>${item.year ? escapeHTML(item.year) + " • " : ""}${escapeHTML(item.detail)}</p>
      </div>
    `).join("");

  /* ---------- INTERESTS ---------- */
  document.getElementById("interestList").innerHTML =
    renderTags(data.interests);

  /* ---------- EXPERIENCE ---------- */
document.getElementById("experienceList").innerHTML =
  (data.experience || []).map(item => `
    <article class="timeline-item">
      <h3>${escapeHTML(item.role)}</h3>
      <div class="timeline-meta">
        ${escapeHTML(item.organisation)} | ${escapeHTML(item.period)}
      </div>
      ${item.description ? `<p>${escapeHTML(item.description)}</p>` : ""}
      ${(item.responsibilities || []).length ? `
        <ul>
          ${(item.responsibilities || []).map(t =>
            `<li>${escapeHTML(t)}</li>`).join("")}
        </ul>
      ` : ""}
    </article>
  `).join("");
  /* ---------- MENTORSHIP (supports single object OR array) ---------- */
  const mentorshipContainer = document.getElementById("mentorshipContent");
  const mentorItems = Array.isArray(data.mentorship)
    ? data.mentorship
    : (data.mentorship ? [data.mentorship] : []);

  mentorshipContainer.innerHTML = mentorItems.map((mentor, idx) => `
    ${idx > 0
      ? '<hr style="border:0;border-top:1px solid var(--border);margin:28px 0;">'
      : ""}
    <h3>${escapeHTML(mentor.title)}</h3>
    <div class="card-meta">
      ${escapeHTML(mentor.organisation)} | ${escapeHTML(mentor.period)}
    </div>
    <p>${escapeHTML(mentor.description || "")}</p>
    ${(mentor.contributions || []).length ? `
      <h3 style="margin-top:14px;">Contributions</h3>
      <ul>
        ${(mentor.contributions || []).map(i =>
          `<li>${escapeHTML(i)}</li>`).join("")}
      </ul>
    ` : ""}
    <div class="tag-list">${renderTags(mentor.focus || [])}</div>
  `).join("");

    /* ---------- COMPETITIONS ---------- */
  const competitionList = document.getElementById("competitionList");
  const competitions = data.competitions || [];

  if (!competitions.length) {
    competitionList.innerHTML = renderEmpty("No entries available.");
  } else {
    competitionList.innerHTML = competitions.map(item => `
      <article class="content-card">
        <div class="card-meta">
          ${escapeHTML(item.year)} | ${escapeHTML(item.organiser)}
        </div>
        <h3>${escapeHTML(item.title)}</h3>
        <p><strong>${escapeHTML(item.event)}</strong></p>
        <p>${escapeHTML(item.description)}</p>
        <span class="status">${escapeHTML(item.category)}</span>
        ${renderEvidence(item.evidence)}
      </article>
    `).join("");
  }

  /* ---------- EVENTS ORGANISED ---------- */
  const eventList = document.getElementById("eventList");
  const eventsOrganised = data.eventsOrganised || [];

  if (!eventsOrganised.length) {
    eventList.innerHTML = renderEmpty("Event entries will be added here.");
  } else {
    eventList.innerHTML = eventsOrganised.map(item => `
      <article class="content-card">
        <div class="card-meta">
          ${escapeHTML(item.year)} | ${escapeHTML(item.role || "")}
        </div>
        <h3>${escapeHTML(item.title)}</h3>
        ${item.event ? `<p><strong>${escapeHTML(item.event)}</strong></p>` : ""}
        <p>${escapeHTML(item.description || "")}</p>
        ${item.venue ? `<p style="color:var(--muted);font-size:12px;">📍 ${escapeHTML(item.venue)}</p>` : ""}
        ${(item.partners || []).length
          ? `<div class="tag-list">${renderTags(item.partners)}</div>`
          : ""}
        ${renderEvidence(item.evidence)}
      </article>
    `).join("");
  }

  /* ---------- PROJECTS ---------- */
  const projects = data.projects || [];
  document.getElementById("projectList").innerHTML = projects.length
    ? projects.map(item => {
        const image = safeURL(item.image);
        const link = safeURL(item.link);
        return `
          <article class="content-card">
            ${image
              ? `<img class="card-image" src="${escapeHTML(image)}"
                   alt="${escapeHTML(item.title)}" loading="lazy">`
              : ""}
            <div class="card-meta">${escapeHTML(item.category || "")}</div>
            <h3>${escapeHTML(item.title)}</h3>
            <p>${escapeHTML(item.description)}</p>
            <p><strong>Technologies:</strong>
              ${escapeHTML((item.technologies || []).join(", "))}
            </p>
            <span class="status">${escapeHTML(item.status || "")}</span>
            ${link
              ? `<br><a class="card-link" href="${escapeHTML(link)}"
                   target="_blank" rel="noopener noreferrer">Explore project</a>`
              : ""}
          </article>
        `;
      }).join("")
    : renderEmpty("Project entries will be added after verification.");
  /* ---------- HARDWARE & DESIGN ---------- */
  const designList = document.getElementById("designList");
  const designs = data.hardwareDesign || [];

  if (!designs.length) {
    designList.innerHTML = renderEmpty("Design entries will be added here.");
  } else {
    designList.innerHTML = designs.map(item => {
      const image = safeURL(item.image);
      const link = safeURL(item.link);

      return `
        <article class="content-card">
          ${image
            ? `<img class="card-image" src="${escapeHTML(image)}"
                 alt="${escapeHTML(item.title)}" loading="lazy">`
            : ""}
          <div class="card-meta">${escapeHTML(item.type || "")}</div>
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.description || "")}</p>
          ${item.role
            ? `<p><strong>Role:</strong> ${escapeHTML(item.role)}</p>` : ""}
          ${(item.tools || []).length
            ? `<p><strong>Tools:</strong> ${escapeHTML((item.tools || []).join(", "))}</p>`
            : ""}
          ${item.outcome
            ? `<span class="status">${escapeHTML(item.outcome)}</span>` : ""}
          ${link
            ? `<br><a class="card-link" href="${escapeHTML(link)}"
                 target="_blank" rel="noopener noreferrer">View files</a>`
            : ""}
          ${renderEvidence(item.evidence)}
        </article>
      `;
    }).join("");
  }
  /* ---------- RESEARCH ---------- */
  document.getElementById("researchList").innerHTML =
    (data.research || []).length
      ? data.research.map(item => `
          <article class="content-card">
            <div class="card-meta">RESEARCH AREA</div>
            <h3>${escapeHTML(item.title)}</h3>
            <p>${escapeHTML(item.description)}</p>
            <span class="status">${escapeHTML(item.status)}</span>
            <div class="tag-list">${renderTags(item.technologies || [])}</div>
          </article>
        `).join("")
      : renderEmpty("Research entries will be added here.");

  /* ---------- PUBLICATIONS ---------- */
  document.getElementById("publicationList").innerHTML =
    (data.publications || []).length
      ? data.publications.map(item => {
          const link = safeURL(item.link);
          return `
            <article class="publication-item">
              <h4>${escapeHTML(item.title)}</h4>
              <p>${escapeHTML(item.authors)} | ${escapeHTML(item.venue)} | ${escapeHTML(item.year)}</p>
              ${link
                ? `<a class="card-link" href="${escapeHTML(link)}"
                     target="_blank" rel="noopener noreferrer">Read publication</a>`
                : ""}
            </article>
          `;
        }).join("")
      : renderEmpty("No publications have been added yet.");

    /* ---------- WORKSHOPS (grouped by type) ---------- */
  const workshops = data.workshops || [];

  const organiserWorkshops = workshops.filter(
    w => (w.type || "").toLowerCase() === "organiser"
  );

  const instructorWorkshops = workshops.filter(
    w => (w.type || "").toLowerCase() !== "organiser"
  );

  /* Shared card builder */
  const buildWorkshopCard = (item) => {
    const isOrganiser = (item.type || "").toLowerCase() === "organiser";
    const badgeClass = isOrganiser ? "badge-organiser" : "badge-instructor";
    const badgeLabel = isOrganiser ? "Organiser" : (item.role || "Instructor");

    return `
      <article class="content-card">
        <div class="card-meta">
          <span class="badge-type ${badgeClass}">${escapeHTML(badgeLabel)}</span>
          &nbsp;·&nbsp; ${escapeHTML(item.date || "")}
        </div>
        <h3>${escapeHTML(item.title)}</h3>
        <p><strong>${escapeHTML(item.organiser || "")}</strong></p>
        <p>${escapeHTML(item.description || "")}</p>
        ${item.venue
          ? `<p class="card-fact">📍 ${escapeHTML(item.venue)}</p>` : ""}
        ${item.audience
          ? `<p class="card-fact">👥 ${escapeHTML(item.audience)}</p>` : ""}
        ${renderEvidence(item.evidence)}
      </article>
    `;
  };

  /* Render Organiser group */
  const organiserContainer = document.getElementById("workshopOrganiserList");
  if (!organiserWorkshops.length) {
    organiserContainer.innerHTML = renderEmpty(
      "Workshop organiser entries will be added here."
    );
  } else {
    organiserContainer.innerHTML = organiserWorkshops.map(buildWorkshopCard).join("");
  }

  /* Render Instructor group */
  const instructorContainer = document.getElementById("workshopInstructorList");
  if (!instructorWorkshops.length) {
    instructorContainer.innerHTML = renderEmpty(
      "Workshop instructor entries will be added here."
    );
  } else {
    instructorContainer.innerHTML = instructorWorkshops.map(buildWorkshopCard).join("");
  }

  /* ---------- CONTACT ---------- */
  document.getElementById("contactList").innerHTML =
    (data.contacts || []).map(item => {
      const url = safeURL(item.url);
      return `
        <div class="contact-card">
          <strong>${escapeHTML(item.label)}</strong>
          ${url
            ? `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.value)}</a>`
            : `<span>${escapeHTML(item.value)}</span>`}
        </div>
      `;
    }).join("");

  /* ---------- MOBILE NAV ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- ACTIVE NAV HIGHLIGHT ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = mainNav.querySelectorAll("a[href^='#']");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px" });

  sections.forEach(s => observer.observe(s));

  /* ---------- BACK TO TOP ---------- */
  const backToTop = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 400);
  });
  backToTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ---------- FOOTER YEAR ---------- */
  document.getElementById("currentYear").textContent =
    new Date().getFullYear();

});
