const HEALTH_STATES = [
  "Alabama", "Arizona", "Arkansas", "Colorado", "Delaware", "Florida", "Illinois", "Indiana",
  "Iowa", "Kansas", "Kentucky", "Louisiana", "Maryland", "Michigan", "Mississippi", "Missouri",
  "Montana", "Nebraska", "Nevada", "North Carolina", "Ohio", "Oklahoma", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Virginia", "West Virginia", "Wisconsin", "Wyoming"
];

const ALL_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "Washington, D.C."
];

const vendors = {
  health: {
    name: "Alek Timmons",
    role: "Licensed health insurance advisor",
    focus: "ACA marketplace and private PPO conversations for individuals, families, and small businesses.",
    phone: "713-304-6649",
    tel: "+17133046649",
    email: "alek.helpers@gmail.com",
    website: "https://alekhelpers.github.io/Helpers-Insurance-/",
    google: "",
    states: HEALTH_STATES
  },
  trusts: {
    name: "Robby Almogobar",
    role: "Trusts and wills",
    focus: "Wills, trusts, and estate conversations",
    phone: "",
    tel: "",
    email: "",
    website: "",
    google: "",
    states: []
  }
};

const topics = [
  {
    id: "health",
    kicker: "Coverage",
    title: "Health insurance",
    text: "ACA marketplace plans, private PPO options, or help deciding which conversation to have.",
    questions: [
      { name: "who", label: "Who needs coverage?", options: ["Just me", "Me and a spouse", "A family", "A small business"] },
      { name: "kind", label: "What kind of help do you want?", options: ["ACA / marketplace", "A private PPO", "I'm not sure which fits"] },
      { name: "when", label: "When do you want to talk?", options: ["Ready now", "Within a month", "Just exploring"] }
    ]
  },
  {
    id: "taxes",
    kicker: "Money",
    title: "Taxes, CPA and bookkeeping",
    text: "Filing, bookkeeping, or both, with a CPA we trust.",
    questions: [
      { name: "who", label: "Is this for you or a business?", options: ["Individual", "Small business", "Both"] },
      { name: "kind", label: "What do you need most?", options: ["Tax filing", "Bookkeeping", "Both"] },
      { name: "when", label: "When do you want to talk?", options: ["Ready now", "This season", "Just exploring"] }
    ]
  },
  {
    id: "planner",
    kicker: "Money",
    title: "Financial planner",
    text: "A planner for retirement, investing, or a full picture of the household.",
    questions: [
      { name: "kind", label: "What is the main goal?", options: ["Retirement", "Investing", "A full financial plan", "I'm not sure yet"] },
      { name: "who", label: "Who is this for?", options: ["Just me", "Me and a spouse", "A family"] },
      { name: "when", label: "When do you want to talk?", options: ["Ready now", "Within a month", "Just exploring"] }
    ]
  },
  {
    id: "annuities",
    kicker: "Money",
    title: "Annuities",
    text: "A plain conversation about income, growth, or whether an annuity belongs at all.",
    questions: [
      { name: "kind", label: "What are you considering?", options: ["Income now", "Growth for later", "Someone suggested an annuity", "I'm not sure yet"] },
      { name: "who", label: "Who is this for?", options: ["Just me", "Me and a spouse"] },
      { name: "when", label: "When do you want to talk?", options: ["Ready now", "Within a month", "Just exploring"] }
    ]
  },
  {
    id: "trusts",
    kicker: "Family",
    title: "Trusts and wills",
    text: "Wills, trusts, and the paperwork that keeps a plan clear for the people you love.",
    questions: [
      { name: "kind", label: "What do you need?", options: ["A will", "A trust", "Both", "I'm not sure yet"] },
      { name: "who", label: "Who is this for?", options: ["Just me", "Me and a spouse", "A family estate"] },
      { name: "when", label: "When do you want to talk?", options: ["Ready now", "Within a month", "Just exploring"] }
    ]
  }
];

const home = document.getElementById("view-home");
const flow = document.getElementById("view-flow");
const panel = document.getElementById("flow-panel");
const tiles = document.getElementById("topic-tiles");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".header-nav");
let searchTimer = null;
let lineTimer = null;

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

const header = document.querySelector(".site-header");
if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("is-stuck", window.scrollY > 8);
  }, { passive: true });
}

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.textContent = open ? "Close" : "Menu";
  });
}

if (tiles) {
  tiles.innerHTML = topics.map((topic) => `
    <button class="tile" type="button" data-topic="${topic.id}">
      <div class="tile-kicker">${topic.kicker}</div>
      <h3>${topic.title}</h3>
      <p>${topic.text}</p>
      <span class="tile-go">Answer a few questions</span>
    </button>
  `).join("");

  tiles.addEventListener("click", (event) => {
    const button = event.target.closest("[data-topic]");
    if (!button) return;
    openTopic(button.dataset.topic);
  });
}

document.body.addEventListener("click", (event) => {
  const link = event.target.closest("[data-view='home']");
  if (!link) return;
  event.preventDefault();
  showHome(link.getAttribute("href"));
});

function showHome(hash) {
  if (!home || !flow) return;
  clearTimers();
  flow.classList.remove("is-on");
  home.classList.add("is-on");
  if (hash) {
    const target = document.querySelector(hash);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function openTopic(id) {
  const topic = topics.find((item) => item.id === id);
  if (!topic || !home || !flow || !panel) return;
  clearTimers();
  home.classList.remove("is-on");
  flow.classList.add("is-on");
  panel.innerHTML = surveyMarkup(topic);
  window.scrollTo({ top: 0, behavior: "smooth" });
  panel.querySelector("[data-back]").addEventListener("click", () => showHome("#partners"));
  panel.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const answers = Object.fromEntries(data.entries());
    runSearch(topic, answers);
  });
}

function surveyMarkup(topic) {
  const stateOptions = ['<option value="">Select…</option>']
    .concat(ALL_STATES.map((state) => `<option>${state}</option>`))
    .concat('<option>Not sure</option>')
    .join("");
  const fields = topic.questions.map((question) => `
    <label>${question.label}
      <select name="${question.name}" required>
        <option value="">Select…</option>
        ${question.options.map((option) => `<option>${option}</option>`).join("")}
      </select>
    </label>
  `).join("");
  return `
    <button class="text-link back" type="button" data-back>Back to topics</button>
    <p class="eyebrow">${topic.kicker}</p>
    <h2>${topic.title}</h2>
    <p class="quiet">A few questions so we can point you to the right person. This page does not save what you enter.</p>
    <form>
      <label>What state are you in?
        <select name="state" required>${stateOptions}</select>
      </label>
      ${fields}
      <div class="form-actions">
        <button class="btn" type="submit">Find my partner</button>
        <p class="fine">Used only to filter. Not sold.</p>
      </div>
    </form>
  `;
}

function runSearch(topic, answers) {
  panel.innerHTML = `
    <div class="searching" role="status" aria-live="polite">
      <div class="orb" aria-hidden="true"></div>
      <h2 id="search-line">Finding the best fit for you…</h2>
      <p>Matching you with a trusted partner…</p>
    </div>
  `;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = reduce ? 600 : 4000;
  if (!reduce) {
    lineTimer = setTimeout(() => {
      const line = document.getElementById("search-line");
      if (line) line.textContent = "Matching you with a trusted partner…";
    }, 2000);
  }
  searchTimer = setTimeout(() => showResult(topic, answers), wait);
}

function showResult(topic, answers) {
  const result = match(topic.id, answers);
  if (result.status === "match") {
    panel.innerHTML = partnerMarkup(result.vendor, result.note, answers, topic);
    bindPartner(result.vendor, answers, topic);
  } else {
    panel.innerHTML = emptyMarkup(topic, result.reason);
  }
  panel.querySelector("[data-back]").addEventListener("click", () => showHome("#partners"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function match(topicId, answers) {
  if (topicId === "health") {
    const vendor = vendors.health;
    if (answers.state === "Not sure" || vendor.states.includes(answers.state)) {
      const note = answers.state === "Not sure"
        ? "Tell him your state on the call so he can confirm he is licensed there."
        : "";
      return { status: "match", vendor, note };
    }
    return {
      status: "none",
      reason: `We don't have a confirmed health partner for ${answers.state} yet. Nothing you entered was saved or shared.`
    };
  }
  if (topicId === "trusts") {
    return {
      status: "match",
      vendor: vendors.trusts,
      note: "Direct phone, website, and Google listing are still being added for this partner."
    };
  }
  return {
    status: "pending",
    reason: "A trusted partner for this topic is still being confirmed. Nothing you entered was saved or shared."
  };
}

function partnerMarkup(vendor, note, answers, topic) {
  const call = vendor.phone
    ? `<a class="btn" href="tel:${vendor.tel}">Call ${vendor.phone}</a>`
    : "";
  const website = vendor.website
    ? `<a class="btn btn-line" href="${vendor.website}" target="_blank" rel="noopener">Website</a>`
    : "";
  const google = vendor.google
    ? `<a class="btn btn-line" href="${vendor.google}" target="_blank" rel="noopener">Google listing</a>`
    : "";
  const optin = vendor.email ? `
    <div class="optin">
      <h3>Call them when you're ready — or request a callback from this partner only.</h3>
      <button class="btn btn-line" type="button" id="show-optin">Request a call from this partner</button>
      <p class="fine">Your contact info is shared only with this partner, and only if you choose this. It is not sold to anyone else.</p>
      <form id="optin-form" class="hidden" action="https://formsubmit.co/${vendor.email}" method="POST">
        <input type="hidden" name="_subject" value="Better PPO callback request — ${topic.title}" />
        <input type="hidden" name="_next" value="https://alekhelpers.github.io/better-ppo/thank-you/" />
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="topic" value="${topic.title}" />
        <input type="hidden" name="state" value="${answers.state || ""}" />
        <input type="hidden" name="details" value="${Object.entries(answers).filter(([key]) => key !== "state").map(([key, value]) => `${key}: ${value}`).join("; ")}" />
        <label>Your name
          <input name="name" required autocomplete="name" />
        </label>
        <label>Your phone
          <input name="phone" type="tel" required autocomplete="tel" />
        </label>
        <label>A good time to call
          <input name="when" placeholder="Afternoon, tomorrow morning…" />
        </label>
        <div class="form-actions">
          <button class="btn" type="submit">Send this request to the partner</button>
        </div>
        <p class="fine">Goes only to this partner. First request may need an email confirmation.</p>
      </form>
    </div>
  ` : "";
  return `
    <button class="text-link back" type="button" data-back>Back to topics</button>
    <div class="partner">
      <p class="eyebrow">Your match · ${topic.title}</p>
      <h2>${vendor.name}</h2>
      <p class="role">${vendor.role}</p>
      <p>${vendor.focus}</p>
      ${note ? `<p class="notice">${note}</p>` : ""}
      <div class="contact-row">${call}${website}${google}</div>
      <p class="tip"><strong>Mention Better PPO</strong> when you reach out, so they know how you found them.</p>
      ${optin}
    </div>
  `;
}

function bindPartner(vendor, answers, topic) {
  const opener = document.getElementById("show-optin");
  const form = document.getElementById("optin-form");
  if (!opener || !form) return;
  opener.addEventListener("click", () => {
    form.classList.remove("hidden");
    opener.classList.add("hidden");
    form.querySelector("input[name='name']").focus();
  });
}

function emptyMarkup(topic, reason) {
  return `
    <button class="text-link back" type="button" data-back>Back to topics</button>
    <div class="partner">
      <p class="eyebrow">${topic.title}</p>
      <h2>No partner to show yet</h2>
      <p class="notice">${reason}</p>
      <p class="quiet">You can come back later. You are not on a list.</p>
    </div>
  `;
}

function clearTimers() {
  if (searchTimer) clearTimeout(searchTimer);
  if (lineTimer) clearTimeout(lineTimer);
  searchTimer = null;
  lineTimer = null;
}

const startTopic = new URLSearchParams(window.location.search).get("topic");
if (startTopic && topics.some((topic) => topic.id === startTopic)) {
  openTopic(startTopic);
}
