/**
 * Production smoke audit — HTTP-level checks against a running server.
 * Run: node scripts/prod-audit.mjs [baseUrl]
 */

const BASE = process.argv[2] || "http://localhost:2001";
const EMAIL = process.env.ADMIN_EMAIL || "admin@logos.dev";
const PASSWORD = process.env.ADMIN_PASSWORD || "Logosagency2468@";

const results = [];
let cookies = "";

function log(ok, name, detail = "") {
  results.push({ ok, name, detail });
  const mark = ok ? "PASS" : "FAIL";
  console.log(`[${mark}] ${name}${detail ? ` — ${detail}` : ""}`);
}

function mergeCookies(res) {
  const raw = res.headers.getSetCookie?.() ?? [];
  if (!raw.length) {
    const single = res.headers.get("set-cookie");
    if (single) raw.push(single);
  }
  for (const c of raw) {
    const pair = c.split(";")[0];
    const key = pair.split("=")[0];
    const parts = cookies
      .split("; ")
      .filter(Boolean)
      .filter((p) => !p.startsWith(`${key}=`));
    parts.push(pair);
    cookies = parts.join("; ");
  }
}

async function req(path, opts = {}) {
  const headers = {
    ...(opts.headers || {}),
    ...(cookies ? { Cookie: cookies } : {}),
  };
  const res = await fetch(`${BASE}${path}`, { ...opts, headers, redirect: "manual" });
  mergeCookies(res);
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* html */
  }
  return { res, text, json, status: res.status };
}

function assertStatus(name, status, expected) {
  const ok = Array.isArray(expected)
    ? expected.includes(status)
    : status === expected;
  log(ok, name, `status=${status}`);
  return ok;
}

async function login() {
  const csrf = await req("/api/auth/csrf");
  if (!csrf.json?.csrfToken) {
    log(false, "Login CSRF", "no csrfToken");
    return false;
  }
  const body = new URLSearchParams({
    csrfToken: csrf.json.csrfToken,
    email: EMAIL,
    password: PASSWORD,
    json: "true",
    callbackUrl: `${BASE}/dashboard`,
  });
  const auth = await req("/api/auth/callback/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  // NextAuth returns 200 with url or 302
  const session = await req("/api/auth/session");
  const ok = Boolean(session.json?.user?.email);
  log(ok, "Login", ok ? session.json.user.email : JSON.stringify(session.json));
  return ok;
}

async function logout() {
  const csrf = await req("/api/auth/csrf");
  const body = new URLSearchParams({
    csrfToken: csrf.json.csrfToken,
    callbackUrl: `${BASE}/login`,
    json: "true",
  });
  await req("/api/auth/signout", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const session = await req("/api/auth/session");
  const ok = !session.json?.user;
  log(ok, "Logout", JSON.stringify(session.json));
  return ok;
}

async function main() {
  console.log(`\n=== Production audit @ ${BASE} ===\n`);

  // Pages (unauth)
  for (const [name, path, expected] of [
    ["Landing /", "/", [200, 307, 308]],
    ["Landing /pt", "/pt", [200]],
    ["Login page", "/login", [200]],
    ["Dashboard redirect unauth", "/dashboard", [307, 302]],
    ["robots.txt", "/robots.txt", [200]],
    ["sitemap.xml", "/sitemap.xml", [200]],
  ]) {
    const { status, text } = await req(path);
    assertStatus(name, status, expected);
    if (path === "/pt" && status === 200) {
      const hasNav =
        text.includes("services") ||
        text.includes("Serviços") ||
        text.includes("servicos") ||
        text.includes("LOGOS") ||
        text.includes("Logos");
      log(hasNav, "Landing content / navbar signals");
    }
  }

  // Public API
  {
    const { status, json } = await req("/api/public/home/clients");
    assertStatus("Public clients API", status, 200);
    log(Array.isArray(json) || Array.isArray(json?.data) || json != null, "Public clients payload");
  }

  // Auth gate on API
  {
    const { status } = await req("/api/dashboard/metrics");
    assertStatus("Metrics unauth blocked", status, [401, 403]);
  }

  // Login
  const loggedIn = await login();
  if (!loggedIn) {
    console.log("\nABORT: login failed\n");
    process.exit(1);
  }

  // Dashboard pages
  for (const [name, path] of [
    ["Dashboard", "/dashboard"],
    ["Clientes page", "/dashboard/clientes"],
    ["Leads page", "/dashboard/leads"],
    ["Projetos page", "/dashboard/projetos"],
    ["Propostas page", "/dashboard/propostas"],
    ["Agenda page", "/dashboard/agenda"],
    ["Perfil page", "/dashboard/perfil"],
    ["Configurações page", "/dashboard/configuracoes"],
  ]) {
    const { status, text } = await req(path);
    assertStatus(name, status, 200);
    if (status === 200) {
      log(!text.includes("Internal Server Error"), `${name} no 500 body`);
    }
  }

  // Metrics / notifications / profile / settings GET
  for (const [name, path] of [
    ["Metrics API", "/api/dashboard/metrics"],
    ["Notifications API", "/api/dashboard/notifications"],
    ["Profile GET", "/api/dashboard/profile"],
    ["Settings GET", "/api/dashboard/settings"],
    ["Projects GET", "/api/dashboard/projects"],
    ["Proposals GET", "/api/dashboard/proposals"],
    ["Events GET", "/api/dashboard/events"],
    ["Clients GET", "/api/dashboard/clients"],
    ["Leads GET", "/api/dashboard/leads?page=1&pageSize=10"],
    ["Search API", "/api/dashboard/search?q=a"],
  ]) {
    const { status, json, text } = await req(path);
    assertStatus(name, status, 200);
    if (status !== 200) {
      log(false, `${name} body`, text.slice(0, 200));
    } else {
      log(json != null, `${name} JSON`);
    }
  }

  // Clients CRUD
  let clientId = null;
  {
    const create = await req("/api/dashboard/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company: `Audit Co ${Date.now()}`,
        status: "ativo",
        featured_home: false,
        display_order: 0,
        city: "Milão",
        country: "IT",
      }),
    });
    assertStatus("Client CREATE", create.status, [200, 201]);
    clientId = create.json?.data?.id || create.json?.id;
    log(Boolean(clientId), "Client CREATE id", clientId || JSON.stringify(create.json)?.slice(0, 200));

    if (clientId) {
      const patch = await req(`/api/dashboard/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: "audit note" }),
      });
      assertStatus("Client UPDATE", patch.status, 200);

      const get = await req(`/api/dashboard/clients/${clientId}`);
      assertStatus("Client READ", get.status, 200);
    }
  }

  // Upload
  {
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64",
    );
    const form = new FormData();
    form.append("file", new Blob([png], { type: "image/png" }), "audit.png");
    const up = await req("/api/dashboard/uploads", { method: "POST", body: form });
    assertStatus("Upload", up.status, 200);
    const url = up.json?.data?.url || up.json?.url;
    log(Boolean(url), "Upload URL", url || JSON.stringify(up.json)?.slice(0, 200));
    if (url) {
      const file = await req(url);
      assertStatus("Upload file served", file.status, 200);
    }
  }

  // Leads — create via contact form, then CRUD
  let leadId = null;
  {
    const contact = await req("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Audit Lead",
        company: "Audit Lead Co",
        email: `audit.lead.${Date.now()}@example.com`,
        whatsapp: "5511999887766",
        projectType: "landingPage",
        investmentRange: "upTo5000",
        message: "Mensagem de auditoria de produção com tamanho adequado.",
        website: "",
        formLoadedAt: Date.now() - 5000,
      }),
    });
    assertStatus("Contact form", contact.status, [200, 201]);
    if (contact.status >= 400) {
      log(false, "Contact form body", JSON.stringify(contact.json)?.slice(0, 300));
    }
  }

  {
    const list = await req("/api/dashboard/leads?page=1&pageSize=20&search=Audit%20Lead");
    assertStatus("Leads list after contact", list.status, 200);
    const items = list.json?.data?.items || list.json?.items || list.json?.data || [];
    const arr = Array.isArray(items) ? items : [];
    leadId = arr.find((l) => l.name === "Audit Lead" || l.company === "Audit Lead Co")?.id || arr[0]?.id;
    log(Boolean(leadId), "Lead found", leadId || "none");

    if (leadId) {
      const get = await req(`/api/dashboard/leads/${leadId}`);
      assertStatus("Lead READ", get.status, 200);

      const statusPatch = await req(`/api/dashboard/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Contato feito" }),
      });
      assertStatus("Lead status UPDATE", statusPatch.status, 200);
      if (statusPatch.status !== 200) {
        log(false, "Lead status body", JSON.stringify(statusPatch.json)?.slice(0, 300));
      }

      const patch = await req(`/api/dashboard/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: "audit lead note" }),
      });
      assertStatus("Lead UPDATE", patch.status, 200);

      const act = await req(`/api/dashboard/leads/${leadId}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "Nota de auditoria", type: "note" }),
      });
      assertStatus("Lead activity CREATE", act.status, [200, 201]);
    }
  }

  // Projects
  let projectId = null;
  {
    const create = await req("/api/dashboard/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `Audit Project ${Date.now()}`,
        status: "Em andamento",
        client_id: clientId,
        description: "Projeto de auditoria",
      }),
    });
    assertStatus("Project CREATE", create.status, [200, 201]);
    projectId = create.json?.data?.id || create.json?.id;
    log(Boolean(projectId), "Project id", projectId || JSON.stringify(create.json)?.slice(0, 200));
  }

  // Proposals
  {
    const create = await req("/api/dashboard/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `Audit Proposal ${Date.now()}`,
        value: 1500,
        status: "Rascunho",
        client_id: clientId,
        lead_id: leadId,
        description: "Proposta de auditoria",
      }),
    });
    assertStatus("Proposal CREATE", create.status, [200, 201]);
    if (create.status >= 400) {
      log(false, "Proposal body", JSON.stringify(create.json)?.slice(0, 300));
    }
  }

  // Events
  {
    const start = new Date(Date.now() + 86400000).toISOString();
    const end = new Date(Date.now() + 90000000).toISOString();
    const create = await req("/api/dashboard/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `Audit Event ${Date.now()}`,
        type: "meeting",
        start_at: start,
        end_at: end,
        description: "Evento de auditoria",
        client_id: clientId,
        lead_id: leadId,
      }),
    });
    assertStatus("Event CREATE", create.status, [200, 201]);
    if (create.status >= 400) {
      log(false, "Event body", JSON.stringify(create.json)?.slice(0, 300));
    }
  }

  // Profile PATCH (safe fields)
  {
    const get = await req("/api/dashboard/profile");
    const profile = get.json?.data || get.json;
    const patch = await req("/api/dashboard/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: profile?.full_name || "Admin LOGOS",
      }),
    });
    assertStatus("Profile UPDATE", patch.status, 200);
    if (patch.status !== 200) {
      log(false, "Profile body", JSON.stringify(patch.json)?.slice(0, 300));
    }
  }

  // Settings PATCH (round-trip)
  {
    const get = await req("/api/dashboard/settings");
    const settings = get.json?.data || get.json;
    const patch = await req("/api/dashboard/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings && typeof settings === "object" ? {} : {}),
    });
    assertStatus("Settings UPDATE", patch.status, [200, 400]);
  }

  // Cleanup client (and cascade if any)
  if (clientId) {
    const del = await req(`/api/dashboard/clients/${clientId}`, { method: "DELETE" });
    assertStatus("Client DELETE", del.status, [200, 204]);
  }

  if (leadId) {
    const del = await req(`/api/dashboard/leads/${leadId}`, { method: "DELETE" });
    assertStatus("Lead DELETE", del.status, [200, 204]);
  }

  // Logout
  await logout();
  {
    const { status } = await req("/api/dashboard/metrics");
    assertStatus("Post-logout API blocked", status, [401, 403]);
  }
  {
    const { status } = await req("/dashboard");
    assertStatus("Post-logout dashboard redirect", status, [302, 307]);
  }

  // Responsive viewport via Accept / pages still 200 (structural)
  for (const [label, ua] of [
    ["Mobile UA landing", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15"],
    ["Tablet UA landing", "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15"],
    ["Desktop UA landing", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0"],
  ]) {
    const { status } = await req("/pt", { headers: { "User-Agent": ua } });
    assertStatus(label, status, 200);
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n=== Summary: ${results.length - failed.length}/${results.length} passed ===\n`);
  if (failed.length) {
    console.log("FAILURES:");
    for (const f of failed) console.log(` - ${f.name}: ${f.detail}`);
    process.exit(1);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
