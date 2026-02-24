# Innovative X — SuperAdmin Panel

A web-based SuperAdmin dashboard for managing clients, MCX API feeds, and frontend content for the Innovative X SaaS platform (Live Bullion View).

---

## 📁 Folder Structure

```
superadmin/
  ├── index.html          ← Login page
  ├── index.css           ← Login page styles
  ├── index.js            ← Login page logic + OTP flow
  ├── dashboard.html      ← Main dashboard
  ├── dashboard.css       ← Dashboard styles
  ├── dashboard.js        ← Dashboard logic + all UI interactions
  └── assets/
        ├── logo.png
        ├── favicon.ico
        ├── favicon.svg
        ├── favicon-96x96.png
        ├── apple-touch-icon.png
        └── site.webmanifest
```

---

## 🚀 How to Run Locally

1. Download all 6 files + the `assets/` folder
2. Keep everything in the **same folder** — do not separate files into subfolders
3. Open `index.html` in any browser
4. Enter any username & password → enter any 6-digit OTP → redirects to dashboard

> ⚠️ No backend is connected yet. All data is dummy/placeholder.

---

## 🌐 How to Deploy

### Option 1 — Shared Hosting (cPanel)
1. Login to cPanel → File Manager
2. Navigate to `public_html/` or create a subfolder e.g. `public_html/admin/`
3. Upload all 6 files + `assets/` folder
4. Access via `yourdomain.com/admin`

### Option 2 — VPS / Server (Nginx or Apache)
1. Upload files to `/var/www/html/admin/`
2. Configure Nginx or Apache to serve that directory
3. Access via `yourdomain.com/admin`

### Option 3 — Same Server as Backend
1. Place the superadmin folder inside the `public/` or `static/` directory of your backend project
2. Backend serves the HTML files directly

---

## 🧩 Features

### MCX API
- **Market Watch** — View live script data (Bid, Ask, High, Low), add/edit/delete scripts, right-click context menu, feed provider column (UPSTOX / GDF / SAMCO)
- **API Status** — Monitor client connection status, toggle API access on/off, connect/disconnect sessions
- **Configuration** — Manage UPSTOX, GDF, SAMCO provider credentials (username, password, mobile, email, sender/target company ID, IP, port) with live connection indicator

### Clients
- **Add Client** — Full client onboarding form with basic info, domain, client ID, admin features, frontend page toggles, website contact details, theme colors, social media links
- **Edit Client** — Pre-fill and update existing client data, delete client with OTP verification

### Frontend Settings
Select a client and manage their website content directly:
- **About Us** — Page title, Our Story, Our Commitment (bullet points), Our Products (bullet points), Certification Details (3 slots with heading + image + details)
- **Contact Us** — Page description, 3 info sections with on/off toggles, Google Maps embed, 2 address slots
- **Privacy Policy & Terms of Service** — Editable headings and full content

---

## 🔌 API Integration Guide (For Backend Team)

All API endpoints are marked in `dashboard.js` with the comment:
```
// Team:
```

Search for `// Team:` in `dashboard.js` to find every place that needs a real API call.

### Auth
| Action | Method | Endpoint |
|---|---|---|
| Login | POST | `/api/auth/login` |
| Verify OTP | POST | `/api/auth/verify-otp` |

### Clients
| Action | Method | Endpoint |
|---|---|---|
| Get all clients | GET | `/api/clients` |
| Get single client | GET | `/api/clients/:id` |
| Add client | POST | `/api/clients` |
| Update client | PUT | `/api/clients/:id` |
| Send delete OTP | POST | `/api/clients/:id/send-delete-otp` |
| Delete client | DELETE | `/api/clients/:id` |

### Market Watch
| Action | Method | Endpoint |
|---|---|---|
| Get scripts | GET | `/api/market-watch/scripts` |
| Add script | POST | `/api/market-watch/scripts` |
| Update script | PUT | `/api/market-watch/scripts/:id` |
| Delete script | DELETE | `/api/market-watch/scripts/:id` |

### API Status
| Action | Method | Endpoint |
|---|---|---|
| Toggle API access | PUT | `/api/clients/:id/api-access` |
| Connect | POST | `/api/clients/:id/connect` |
| Disconnect | POST | `/api/clients/:id/disconnect` |

### API Configuration (Providers)
| Action | Method | Endpoint |
|---|---|---|
| Get config | GET | `/api/config/:provider` |
| Save config | POST | `/api/config/:provider` |
| Get status | GET | `/api/config/:provider/status` |

### Frontend Settings
| Action | Method | Endpoint |
|---|---|---|
| Get section data | GET | `/api/frontend/:clientId/:section` |
| Save section data | PUT | `/api/frontend/:clientId/:section` |

> Sections: `about-us` / `contact-us` / `privacy-terms`

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--blue` | `#0f8fff` | Primary actions, highlights |
| `--blue2` | `#1a6bff` | Gradients |
| `--green` | `#aaee00` | Active states, success accents |
| `--bg` | `#000000` | Page background |
| `--surface` | `#080f16` | Cards, sidebar |
| `--success` | `#00dd88` | Connected status |
| `--error` | `#ff4455` | Errors, disconnect |
| `--warning` | `#ffaa00` | Warning states |

**Fonts:**
- `Rajdhani` — UI text, labels, buttons
- `JetBrains Mono` — Data, codes, timestamps

---

## ⚠️ Important Notes

- All form `name=""` attributes in `dashboard.html` are ready-to-use API field keys
- Dummy client data is in the `DUMMY_CLIENTS` object in `dashboard.js` — replace with real API calls
- Do **not** use real credentials, account numbers, or personal data as placeholder values
- Assets folder must stay at the same level as HTML files for favicons and logo to load correctly
- Font Awesome CDN is used for social media icons — internet connection required

---

## 👥 Team Responsibilities

| Role | Files |
|---|---|
| HTML Developer | `index.html`, `dashboard.html` |
| CSS Developer | `index.css`, `dashboard.css` |
| Backend / JS Developer | `index.js`, `dashboard.js` |
| DevOps | Server setup, domain, SSL |

---

## 📞 Project

**Platform:** Innovative X — www.innovativex.in
**Type:** SaaS — Live Bullion View Web Apps
**Panel:** SuperAdmin
