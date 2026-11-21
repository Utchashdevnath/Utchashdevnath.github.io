/* ============================================================
   PORTFOLIO ENGINE — reads content.js and renders the page.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  const data = window.portfolioData;
  if (!data) {
    console.error("Portfolio content could not be loaded. Check content.js.");
    return;
  }

  /* ---------- Helpers ---------- */
  const escapeHTML = (value = "") =>
    String(value).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[c]);

  const safeURL = (url = "") => {
    const v = String(url || "").trim();
    if (/^(https?:\/\/|mailto:)/i.test(v)) return v;
    if (/^(images|documents)\//i.test(v)) return v;
    return "";
  };

  const renderTags = (items = []) =>
    items.map(i => `<span class="tag">${escapeHTML(i)}</span>`).join("");

  const renderEmpty = msg =>
    `<p class="empty-message">${escapeHTML(msg)}</p>`;

  /* ---------- Evidence: arrays, 3-visible + See more ---------- */
  const normalizeEvidence = (e) => {
    if (!e) return [];
    if (Array.isArray(e)) return e.map(x => String(x || "").trim()).filter(Boolean);
    if (typeof e === "string" && e.trim()) return [e.trim()];
    return [];
  };

  const isImageFile = (url) => /\.(jpe?g|png|webp|gif|avif|bmp)$/i.test(url);

  const buildEvidenceTile = (url, i) => {
    if (isImageFile(url)) {
      return `<a href="${escapeHTML(url)}" target="_blank"
                 rel="noopener noreferrer" class="evidence-thumb"
                 title="Open evidence ${i + 1}">
                <img src="${escapeHTML(url)}" alt="Evidence ${i + 1}" loading="lazy">
              </a>`;
    }
    return `<a href="${escapeHTML(url)}" target="_blank"
               rel="noopener noreferrer" class="evidence-link">📄 Evidence ${i + 1}</a>`;
  };

  const renderEvidence = (evidence) => {
    const items = normalizeEvidence(evidence).map(safeURL).filter(Boolean);
    if (!items.length) return "";

    const firstThree = items.slice(0, 3);
    const rest = items.slice(3);

    const visible = firstThree.map((url, i) => buildEvidenceTile(url, i)).join("");
    const hidden  = rest.map((url, i) => buildEvidenceTile(url, i + 3)).join("");

    return `
      <div class="evidence-gallery">
        <div class="evidence-row">${visible}</div>
        ${rest.length ? `
          <div class="evidence-more collapsed">${hidden}</div>
          <button type="button" class="evidence-toggle" data-count="${rest.length}">
            +${rest.length} more
          </button>
        ` : ""}
      </div>
    `;
  };

  /* Global toggle handler (works for all sections) */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".evidence-toggle");
    if (!btn) return;
    const gallery = btn.closest(".evidence-gallery");
    if (!gallery) return;
    const more = gallery.querySelector(".evidence-more");
    const collapsed = more.classList.toggle("collapsed");
    btn.textContent = collapsed ? `+${btn.dataset.count} more` : "Show less";
  });

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

  /* ---------- INTERESTS ---------- */
  document.getElementById("interestList").innerHTML =
    renderTags(data.interests);

  /* ---------- EDUCATION ---------- */
  const eduEl = document.getElementById("educationList");
  if (eduEl) {
    eduEl.innerHTML = (data.education || []).map(item => `
      <article class="content-card">
        ${item.year ? `<div class="card-meta">${escapeHTML(item.year)}</div>` : ""}
        <h3>${escapeHTML(item.degree)}</h3>
        <p><strong>${escapeHTML(item.institution)}</strong></p>
        ${item.detail ? `<p>${escapeHTML(item.detail)}</p>` : ""}
      </article>
    `).join("");
  }

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
            ${item.responsibilities.map(t => `<li>${escapeHTML(t)}</li>`).join("")}
          </ul>` : ""}
      </article>
    `).join("");

  /* ---------- MENTORSHIP (array or object) ---------- */
  const mentorshipItems = Array.isArray(data.mentorship)
    ? data.mentorship
    : (data.mentorship ? [data.mentorship] : []);

  const mentorshipEl = document.getElementById("mentorshipContent");
  if (mentorshipEl) {
    mentorshipEl.innerHTML = mentorshipItems.map((m, idx) => `
      ${idx > 0 ? '<hr style="border:0;border-top:1px solid var(--border);margin:28px 0;">' : ""}
      <h3>${escapeHTML(m.title)}</h3>
      <div class="card-meta">${escapeHTML(m.organisation || "")} | ${escapeHTML(m.period || "")}</div>
      ${m.description ? `<p>${escapeHTML(m.description)}</p>` : ""}
      ${(m.contributions || []).length ? `
        <h3 style="margin-top:14px;">Contributions</h3>
        <ul>${m.contributions.map(c => `<li>${escapeHTML(c)}</li>`).join("")}</ul>
      ` : ""}
      <div class="tag-list">${renderTags(m.focus || [])}</div>
    `).join("");
  }

  /* ---------- LEADERSHIP SUMMARY BAND ---------- */
  const ls = data.leadershipSummary || {};
  const lsEl = document.getElementById("leadershipSummary");
  if (lsEl) {
    const stat = (val, label) => `
      <div class="stat">
        <strong>${escapeHTML(String(val ?? "—"))}</strong>
        <span>${escapeHTML(label)}</span>
      </div>`;
    lsEl.innerHTML = `
      <div class="leadership-stats">
        ${stat(ls.studentsMentored, "Students mentored")}
        ${stat(ls.eventsOrganised, "Events organised")}
        ${stat(ls.workshopsDelivered, "Workshops delivered")}
        ${stat(ls.podiumFinishes, "Podium finishes")}
      </div>
      ${ls.period ? `<p class="leadership-period">${escapeHTML(ls.period)}</p>` : ""}
    `;
  }

  /* ---------- PERSONAL ACHIEVEMENTS ---------- */
  const personalEl = document.getElementById("personalAchievementList");
  const personalAchievements = data.personalAchievements || [];
  if (personalEl) {
    personalEl.innerHTML = personalAchievements.length
      ? personalAchievements.map(item => `
          <article class="content-card">
            <div class="card-meta">
              ${escapeHTML(item.year || "")} | ${escapeHTML(item.organiser || "")}
            </div>
            <h3>${escapeHTML(item.title)}</h3>
            ${item.event ? `<p><strong>${escapeHTML(item.event)}</strong></p>` : ""}
            <p>${escapeHTML(item.description || "")}</p>
            ${item.category ? `<span class="status">${escapeHTML(item.category)}</span>` : ""}
            ${renderEvidence(item.evidence)}
          </article>
        `).join("")
      : renderEmpty("Personal achievement entries will be added here.");
  }

  /* ---------- COMPETITIONS (Student Achievements) ---------- */
  const competitionList = document.getElementById("competitionList");
  const competitions = data.competitions || [];
  if (competitionList) {
    competitionList.innerHTML = competitions.length
      ? competitions.map(item => `
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
        `).join("")
      : renderEmpty("No entries available.");
  }

  const achSumEl = document.getElementById("achievementSummary");
  if (achSumEl && data.studentAchievementSummary) {
    achSumEl.textContent = data.studentAchievementSummary;
  }

  /* ---------- EVENTS ORGANISED ---------- */
  const eventList = document.getElementById("eventList");
  const eventsOrganised = data.eventsOrganised || [];
  if (eventList) {
    eventList.innerHTML = eventsOrganised.length
      ? eventsOrganised.map(item => `
          <article class="content-card">
            <div class="card-meta">
              ${escapeHTML(item.year || "")} | ${escapeHTML(item.role || "")}
            </div>
            <h3>${escapeHTML(item.title)}</h3>
            ${item.event ? `<p><strong>${escapeHTML(item.event)}</strong></p>` : ""}
            <p>${escapeHTML(item.description || "")}</p>
            ${item.venue ? `<p class="card-fact">📍 ${escapeHTML(item.venue)}</p>` : ""}
            ${(item.partners || []).length ? `<div class="tag-list">${renderTags(item.partners)}</div>` : ""}
            ${renderEvidence(item.evidence)}
          </article>
        `).join("")
      : renderEmpty("Event entries will be added here.");
  }

  /* ---------- WORKSHOPS (grouped) ---------- */
  const workshops = data.workshops || [];
  const organiserWorkshops = workshops.filter(w => (w.type || "").toLowerCase() === "organiser");
  const instructorWorkshops = workshops.filter(w => (w.type || "").toLowerCase() !== "organiser");

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
        ${item.venue ? `<p class="card-fact">📍 ${escapeHTML(item.venue)}</p>` : ""}
        ${item.audience ? `<p class="card-fact">👥 ${escapeHTML(item.audience)}</p>` : ""}
        ${renderEvidence(item.evidence)}
      </article>
    `;
  };

  const orgList = document.getElementById("workshopOrganiserList");
  if (orgList) {
    orgList.innerHTML = organiserWorkshops.length
      ? organiserWorkshops.map(buildWorkshopCard).join("")
      : renderEmpty("Workshop organiser entries will be added here.");
  }

  const instList = document.getElementById("workshopInstructorList");
  if (instList) {
    instList.innerHTML = instructorWorkshops.length
      ? instructorWorkshops.map(buildWorkshopCard).join("")
      : renderEmpty("Workshop instructor entries will be added here.");
  }

  /* ---------- PROJECTS ---------- */
  const projects = data.projects || [];
  const projectList = document.getElementById("projectList");
  if (projectList) {
    projectList.innerHTML = projects.length
      ? projects.map(item => {
          const image = safeURL(item.image);
          const link = safeURL(item.link);
          return `
            <article class="content-card">
              ${image ? `<img class="card-image" src="${escapeHTML(image)}"
                   alt="${escapeHTML(item.title)}" loading="lazy">` : ""}
              <div class="card-meta">${escapeHTML(item.category || "")}</div>
              <h3>${escapeHTML(item.title)}</h3>
              <p>${escapeHTML(item.description || "")}</p>
              ${(item.technologies || []).length
                ? `<p><strong>Technologies:</strong> ${escapeHTML((item.technologies || []).join(", "))}</p>`
                : ""}
              ${item.status ? `<span class="status">${escapeHTML(item.status)}</span>` : ""}
              ${link ? `<br><a class="card-link" href="${escapeHTML(link)}"
                   target="_blank" rel="noopener noreferrer">Explore project</a>` : ""}
              ${renderEvidence(item.evidence)}
            </article>`;
        }).join("")
      : renderEmpty("Project entries will be added here.");
  }

  /* ---------- HARDWARE & DESIGN ---------- */
  const designs = data.hardwareDesign || [];
  const designList = document.getElementById("designList");
  if (designList) {
    designList.innerHTML = designs.length
      ? designs.map(item => {
          const image = safeURL(item.image);
          const link = safeURL(item.link);
          return `
            <article class="content-card">
              ${image ? `<img class="card-image" src="${escapeHTML(image)}"
                   alt="${escapeHTML(item.title)}" loading="lazy">` : ""}
              <div class="card-meta">${escapeHTML(item.type || "")}</div>
              <h3>${escapeHTML(item.title)}</h3>
              <p>${escapeHTML(item.description || "")}</p>
              ${item.role ? `<p><strong>Role:</strong> ${escapeHTML(item.role)}</p>` : ""}
              ${(item.tools || []).length
                ? `<p><strong>Tools:</strong> ${escapeHTML((item.tools || []).join(", "))}</p>`
                : ""}
              ${item.outcome ? `<span class="status">${escapeHTML(item.outcome)}</span>` : ""}
              ${link ? `<br><a class="card-link" href="${escapeHTML(link)}"
                   target="_blank" rel="noopener noreferrer">View files</a>` : ""}
              ${renderEvidence(item.evidence)}
            </article>`;
        }).join("")
      : renderEmpty("Design entries will be added here.");
  }

  /* ---------- RESEARCH ---------- */
  const researchList = document.getElementById("researchList");
  if (researchList) {
    researchList.innerHTML = (data.research || []).length
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
  }

  /* ---------- PUBLICATIONS ---------- */
  document.getElementById("publicationList").innerHTML =
    (data.publications || []).length
      ? data.publications.map(item => {
          const link = safeURL(item.link);
          return `
            <article class="publication-item">
              <h4>${escapeHTML(item.title)}</h4>
              <p>${escapeHTML(item.authors)} | ${escapeHTML(item.venue)} | ${escapeHTML(item.year)}</p>
              ${link ? `<a class="card-link" href="${escapeHTML(link)}"
                   target="_blank" rel="noopener noreferrer">Read publication</a>` : ""}
            </article>`;
        }).join("")
      : renderEmpty("No publications have been added yet.");

  /* ---------- TRAINING & CERTIFICATIONS (compact list) ---------- */
  const certList = document.getElementById("certificationList");
  const certs = data.certifications || [];
  if (certList) {
    certList.innerHTML = certs.length
      ? certs.map(item => {
          const link = safeURL(item.link);
          return `
            <article class="cert-item">
              <div class="cert-year">${escapeHTML(item.year || "")}</div>
              <div class="cert-body">
                <h4>${escapeHTML(item.title)}</h4>
                <p class="cert-provider">${escapeHTML(item.provider || "")}${
                  item.detail ? ` · ${escapeHTML(item.detail)}` : ""
                }</p>
              </div>
              ${link ? `<a class="cert-link" href="${escapeHTML(link)}"
                   target="_blank" rel="noopener noreferrer">Verify ↗</a>` : ""}
            </article>`;
        }).join("")
      : renderEmpty("Certifications will be added here.");
  }

  /* ---------- CONTACT ---------- */
  document.getElementById("contactList").innerHTML =
    (data.contacts || []).map(item => {
      const url = safeURL(item.url);
      return `
        <div class="contact-card">
          <strong>${escapeHTML(item.label)}</strong>
          ${url ? `<a href="${escapeHTML(url)}" target="_blank"
               rel="noopener noreferrer">${escapeHTML(item.value)}</a>`
                : `<span>${escapeHTML(item.value)}</span>`}
        </div>`;
    }).join("");

  /* ---------- MOBILE NAV ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  if (menuToggle && mainNav) {
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
  }

  /* ---------- ACTIVE NAV ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = mainNav ? mainNav.querySelectorAll("a[href^='#']") : [];
  if (sections.length && navLinks.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle("active",
              link.getAttribute("href") === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach(s => obs.observe(s));
  }

  /* ---------- BACK TO TOP ---------- */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("visible", window.scrollY > 400);
    });
    backToTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- FOOTER YEAR ---------- */
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
