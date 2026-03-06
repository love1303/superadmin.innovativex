# Innovative X — SuperAdmin Panel

We are creating a Super Admin Web Panel to manage our SaaS users. Since we provide SaaS software, we need a system where we can manage all user settings and configurations from a central panel.

---

## 📁 Folder Structure

```
superadmin/
  ├── index.html            ← Login page
  ├── index.css             ← Login page styles
  ├── index.js              ← Login page logic + OTP flow
  ├── dashboard.html        ← Main dashboard
  ├── dashboard.css         ← Dashboard styles
  ├── dashboard.js          ← Dashboard logic + all UI interactions
  ├── README.md             ← This file
  └── assets/
        ├── logo.png
        ├── favicon.ico
        ├── favicon.svg
        ├── favicon-96x96.png
        ├── apple-touch-icon.png
        └── site.webmanifest
```

> Keep all files in the same folder. Do not separate into subfolders.

---

## 🚀 How to Run Locally

1. Download all 6 files + assets/ folder into one folder
2. Open index.html in any browser
3. Enter any username and password → enter any 6-digit OTP → redirects to dashboard
4. No server required — runs directly in browser

> No backend connected yet. All data is dummy/placeholder.

---

## 🌐 How to Deploy

### Option 1 — Shared Hosting (cPanel)
1. Login to cPanel → File Manager
2. Navigate to public_html/ or create subfolder e.g. public_html/admin/
3. Upload all files + assets/ folder
4. Access via yourdomain.com/admin

### Option 2 — VPS / Server (Nginx or Apache)
1. Upload files to /var/www/html/admin/
2. Configure Nginx or Apache to serve that directory
3. Access via yourdomain.com/admin

### Option 3 — Same Server as Backend
1. Place the superadmin folder inside public/ or static/ directory of backend project
2. Backend serves the HTML files directly

---

## 🧩 Complete Features List

### Login (index.html)
- Username + Password form
- OTP verification popup (6-digit)
- Resend OTP with countdown timer
- Redirects to dashboard.html on success

---

### MCX API

#### Market Watch
- Live scripts table — Bid, Ask, High, Low, Last Updated, Feed Provider
- Right-click context menu on any row — Add / Edit / Delete
- Checkbox selection — enables Edit and Delete buttons in header
- Feed Provider column shows UPSTOX / GDF / SAMCO badge
- Add Script Modal — Script Name, Select Server (Feed Provider), Instrument Name
- Edit Script Modal — pre-fills from selected row
- Delete Script — confirmation modal before deletion

#### API Status
- Table of all clients with:
  - Connection status light (green = Connected, red = Disconnected)
  - API Access toggle ON/OFF
  - Connect button
  - Disconnect button

#### Configuration
- 3 provider cards — UPSTOX, GDF, SAMCO
- Each card has:
  - Active/Inactive toggle
  - Live connection indicator
  - Username / Client ID
  - Password / API Key
  - Mobile Number
  - Email
  - Sender Company ID
  - Target Company ID
  - IP Address
  - Port
  - Save Config button
- API Logs panel — full width at bottom of Configuration page only
  - ON/OFF toggle to enable/disable logging
  - Clear logs button
  - Color coded entries — SUCCESS (green) / ERROR (red) / WARN (yellow) / INFO (blue)
  - Team: call addLog('SUCCESS', 'message') after API responses

---

### Clients

#### Add Client
- Basic Information — Company Name, Email, Mobile, Domain
- Admin Features (toggles) — Bullion with GST, Bullion Without GST, Coins, Live Header Rates, Live MCX Prices
- Coin Dealers (shows only when Coins is ON) — 5 dealer slots, each with name field + ON/OFF toggle
- Frontend Pages (toggles) — Bank Details, About Us, Contact Us, Booking Desk
- Website Contact Details — Company Name on Frontend, Email 1, Email 2, Mobile 1, Mobile 2
- Theme Colors — 5 color pickers:
  - Header Color
  - Footer Color
  - Background Color
  - Section Heading Color
  - Header Button Color
- Social Media Links (each with ON/OFF toggle + URL input):
  - YouTube, Facebook, Instagram, LinkedIn, Google, WhatsApp Chat
  - Add to Home Screen — toggle only

#### Edit Client
- Select Client dropdown loads all client data into form
- Same fields as Add Client
- Delete Client button at bottom:
  - Sends OTP to registered email
  - 6-digit OTP verification popup
  - Resend OTP with 30s countdown
  - Client deleted only after OTP verified
  - Data preserved in DB — website goes offline

#### Inactive Clients
- Table of all deactivated clients
- Shows Company Name, Domain, Email, Mobile, Deactivated On
- Reactivate button per client — brings website back online
- Data always preserved in DB — no data loss on deactivation

---

### Frontend Settings

Select Client → Select Section → form loads dynamically

#### About Us
- Page Heading (editable)
- Our Story — editable section heading + textarea
- Our Commitment — editable heading + dynamic bullet points (add/remove)
- Our Products — editable heading + dynamic bullet points (add/remove)
- Certification Details — editable section heading + 3 certificate slots:
  - Each slot: Heading + Image Upload + Details textarea
  - Image files named cert1.png / cert2.png / cert3.png
  - Headings fully editable (BIS Hallmark, Trade Mark, IBJA, DJF etc.)

#### Contact Us
- Page description textarea
- 3 info sections each with ON/OFF toggle + editable heading + content:
  - Customer Support
  - Feedback and Suggestions
  - Media Inquiries
- Google Maps embed URL input
- 2 Address slots each with ON/OFF toggle + editable heading + address

#### Privacy Policy and Terms of Service
- Privacy Policy — editable heading + large textarea
- Terms of Service — editable heading + large textarea

---

### Meta Settings

Select Client → manage SEO meta for all 5 frontend pages:
- Home — Meta Title + Meta Description
- About Us — Meta Title + Meta Description
- Contact Us — Meta Title + Meta Description
- Bank Details — Meta Title + Meta Description
- Booking Details — Meta Title + Meta Description

Recommended meta description length: 150-160 characters

---

### reCAPTCHA Settings

Select Client → manage Google reCAPTCHA v2 keys:
- Site ID (Public Key) — used in frontend HTML, safe to expose
- Secret Key (Private Key) — used server side only, never expose publicly

How to get keys: google.com/recaptcha/admin → Register domain → reCAPTCHA v2 → Copy keys

---

### SMTP Configuration

Global mail server settings for sending OTPs and system emails:
- SMTP Host — e.g. smtp.gmail.com
- SMTP Port — e.g. 587
- Encryption — TLS (587) / SSL (465) / None (25)
- Username — SMTP login email
- Password — App password or SMTP password
- From Name — Display name in sent emails
- From Email — Sender email address
- Test Email — Send test mail to verify config works

---

## 🔌 API Integration Guide

All API endpoints are marked in dashboard.js with the comment:
// Team:

Search for // Team: in dashboard.js to find every integration point.

### Auth
| Action | Method | Endpoint |
|---|---|---|
| Login | POST | /api/auth/login |
| Verify OTP | POST | /api/auth/verify-otp |

### Clients
| Action | Method | Endpoint |
|---|---|---|
| Get all clients | GET | /api/clients |
| Get inactive clients | GET | /api/clients?status=inactive |
| Get single client | GET | /api/clients/:id |
| Add client | POST | /api/clients |
| Update client | PUT | /api/clients/:id |
| Send delete OTP | POST | /api/clients/:id/send-delete-otp |
| Delete client | DELETE | /api/clients/:id |
| Reactivate client | POST | /api/clients/:id/reactivate |

### Market Watch
| Action | Method | Endpoint |
|---|---|---|
| Get scripts | GET | /api/market-watch/scripts |
| Add script | POST | /api/market-watch/scripts |
| Update script | PUT | /api/market-watch/scripts/:id |
| Delete script | DELETE | /api/market-watch/scripts/:id |

### API Status
| Action | Method | Endpoint |
|---|---|---|
| Toggle API access | PUT | /api/clients/:id/api-access |
| Connect | POST | /api/clients/:id/connect |
| Disconnect | POST | /api/clients/:id/disconnect |

### API Configuration
| Action | Method | Endpoint |
|---|---|---|
| Get config | GET | /api/config/:provider |
| Save config | POST | /api/config/:provider |
| Get status | GET | /api/config/:provider/status |

Providers: upstox / gdf / samco

### Frontend Settings
| Action | Method | Endpoint |
|---|---|---|
| Get section data | GET | /api/frontend/:clientId/:section |
| Save section data | PUT | /api/frontend/:clientId/:section |

Sections: about-us / contact-us / privacy-terms

### Meta Settings
| Action | Method | Endpoint |
|---|---|---|
| Get all meta | GET | /api/meta/:clientId |
| Save all meta | PUT | /api/meta/:clientId |

### reCAPTCHA
| Action | Method | Endpoint |
|---|---|---|
| Get keys | GET | /api/recaptcha/:clientId |
| Save keys | PUT | /api/recaptcha/:clientId |

### SMTP
| Action | Method | Endpoint |
|---|---|---|
| Get config | GET | /api/smtp |
| Save config | POST | /api/smtp |
| Send test email | POST | /api/smtp/test |

---

## 🎨 Design System

### Colors
| Token | Value | Usage |
|---|---|---|
| --blue | #0f8fff | Primary actions, highlights |
| --blue2 | #1a6bff | Gradients |
| --green | #aaee00 | Active states, accents |
| --bg | #000000 | Page background |
| --surface | #080f16 | Cards, sidebar |
| --surface2 | #0c1520 | Nested elements |
| --success | #00dd88 | Connected / success |
| --error | #ff4455 | Errors / disconnect |
| --warning | #ffaa00 | Warnings |
| --muted | #3a6080 | Placeholder text |

### Fonts
- Rajdhani — UI labels, buttons, headings
- JetBrains Mono — Data, codes, timestamps, API keys

### External Libraries (CDN — internet required)
- Google Fonts — Rajdhani + JetBrains Mono
- Font Awesome 6.5.0 — Social media icons

---

## ⚠️ Important Notes for Developers

1. All name="" attributes on form inputs in dashboard.html are ready-to-use API field keys
2. DUMMY_CLIENTS object in dashboard.js has sample client data — replace with real API calls
3. DUMMY_META object in dashboard.js has sample meta data — replace with real API calls
4. Call addLog('SUCCESS'/'ERROR'/'WARN'/'INFO', 'message') in dashboard.js after every connect/disconnect API response
5. Do NOT use real credentials, keys, or personal data as placeholder values in code
6. assets/ folder must stay at same level as HTML files for logo and favicons to load
7. CORS must be enabled on backend for API calls to work from browser
8. Store auth token from login API and send with every request
9. Certificate images for About Us should be stored per client: /clients/:id/assets/cert1.png etc.

---

## 👥 Team Responsibilities

| Role | Files |
|---|---|
| HTML Developer | index.html, dashboard.html |
| CSS Developer | index.css, dashboard.css |
| Backend / JS Developer | index.js, dashboard.js |
| DevOps | Server setup, domain, SSL |

---

## 📞 Project Info

Platform: Innovative X
Website: www.innovativex.in
Type: SaaS — Live Bullion View Web Apps
Panel: SuperAdmin
Version: UI Complete — API Integration Pending
