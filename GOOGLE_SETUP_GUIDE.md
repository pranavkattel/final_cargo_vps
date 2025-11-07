# Google Search Console Setup - Quick Guide

## Step 1: Verify Your Site (5 minutes)

1. Go to: https://search.google.com/search-console
2. Click "Add Property"
3. Enter: `https://cargocapital.com`
4. Choose verification method: **HTML tag**
5. Copy the verification code

## Step 2: Add Verification to index.html

The code will look like:
```html
<meta name="google-site-verification" content="ABC123XYZ..." />
```

Add it in `index.html` head section (I've already added a placeholder):
```html
<!-- Google Site Verification (Add your verification code) -->
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" />
```

Replace `YOUR_VERIFICATION_CODE_HERE` with your actual code.

## Step 3: Deploy and Verify

```bash
# Build with updated verification tag
npm run build

# Deploy to VPS
git add index.html
git commit -m "Add Google Search Console verification"
git push origin main

# On VPS rebuild
git pull && npm run build && pm2 restart cargo-frontend
```

## Step 4: Submit Sitemap

1. Go back to Google Search Console
2. Click "Sitemaps" in left menu
3. Enter: `sitemap.xml`
4. Click "Submit"

## Step 5: Request Indexing

1. Go to "URL Inspection"
2. Enter your homepage: `https://cargocapital.com`
3. Click "Request Indexing"
4. Repeat for important pages:
   - https://cargocapital.com/services
   - https://cargocapital.com/quote
   - https://cargocapital.com/tracking
   - https://cargocapital.com/about
   - https://cargocapital.com/contact

---

## Google Business Profile Setup

1. Go to: https://business.google.com
2. Click "Manage now"
3. Enter business name: **Capital Cargo**
4. Choose category: **Freight Forwarding Service**
5. Add second category: **Logistics Service**
6. Add location: Your Kathmandu office address
7. Add phone: +977-1-XXXXXXX
8. Add website: https://cargocapital.com
9. Add hours: Mon-Sun 8AM-6PM
10. Upload photos (minimum 3):
    - Office exterior
    - Office interior  
    - Team photo
11. Write description:

```
Capital Cargo is Nepal's #1 best cargo company and leading logistics service provider in Kathmandu. We offer top-rated international shipping, air freight, sea freight, and reliable freight forwarding services. Trusted by thousands of businesses for import-export cargo solutions across Nepal and worldwide. Contact us for fast, secure, and affordable cargo delivery.
```

---

## Google Analytics 4 Setup

1. Go to: https://analytics.google.com
2. Click "Admin" → "Create Property"
3. Property name: **Capital Cargo**
4. Select timezone: Nepal
5. Select currency: NPR
6. Create Web Stream: `https://cargocapital.com`
7. Copy your Measurement ID (looks like: `G-XXXXXXXXXX`)

Add to `index.html`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## Get Your First Reviews

**Email Template to Send Customers:**

---

Subject: How was your delivery experience with Capital Cargo?

Dear [Customer Name],

We hope your shipment arrived safely and on time!

As Nepal's leading cargo company, we're always striving to provide the best service. Would you mind taking 2 minutes to share your experience?

👉 Leave a Google Review: [Your Google Business Profile Link]

Your feedback helps us improve and helps other businesses in Nepal find reliable cargo services.

As a thank you, we'll give you 10% off your next shipment!

Best regards,
Capital Cargo Team
https://cargocapital.com

---

**SMS Template:**

"Hi [Name]! Thanks for choosing Capital Cargo. How was your experience? Leave a quick review: [short link]. Get 10% off next shipment!"

---

## Social Media Quick Setup

### Facebook Business Page
1. Go to: https://facebook.com/pages/create
2. Page name: **Capital Cargo**
3. Category: **Cargo & Freight Company**
4. Bio: "Nepal's #1 cargo company | Best international shipping & logistics services in Kathmandu"
5. Website: https://cargocapital.com
6. Phone: +977-1-XXXXXXX
7. Upload logo as profile picture
8. Upload cover photo (trucks/planes/shipping)

**First 5 Posts:**
1. Welcome post introducing Capital Cargo
2. Service overview (air, sea, land freight)
3. Customer testimonial
4. "How to ship from Nepal" tips
5. Behind-the-scenes photo

### LinkedIn Company Page
1. Go to: https://linkedin.com/company/setup/new
2. Company name: **Capital Cargo**
3. LinkedIn URL: linkedin.com/company/capital-cargo
4. Website: https://cargocapital.com
5. Industry: **Transportation, Logistics, Supply Chain and Storage**
6. Company size: Select appropriate size
7. Type: **Privately Held**
8. Upload logo
9. Add tagline: "Nepal's #1 Cargo & Freight Forwarding Company"

---

## Nepal Business Directories (List ASAP)

### Free Listings:
1. **Nepal Business Directory**: https://nepalbusinessdirectory.com
2. **Kathmandu Directory**: Search "add business Kathmandu"
3. **FNCCI Member Directory**: https://fncci.org (apply for membership)
4. **Yellow Pages Nepal**: Search online
5. **Justdial Nepal**: If available

### Each listing should have:
- Business name: Capital Cargo
- Category: Cargo Services / Freight Forwarding / Logistics
- Address: Your Kathmandu office
- Phone: +977-1-XXXXXXX
- Website: https://cargocapital.com
- Description: (Use SEO-optimized text)

```
Capital Cargo is Nepal's leading cargo company providing best international shipping, air freight, sea freight, and logistics services in Kathmandu. As the #1 freight forwarding service provider in Nepal, we offer reliable cargo delivery, import-export solutions, and door-to-door shipping across Nepal and worldwide. Contact us for trusted cargo services.
```

---

## Track Your Rankings

### Free Method (Weekly Check):
1. Open incognito browser
2. Google: "best cargo company in Nepal"
3. Note your position (page number + position)
4. Repeat for all 20 target keywords
5. Log in spreadsheet

### Use Tools:
- Google Search Console (Position column)
- Ubersuggest (free 3 searches/day)
- SERPWatcher (paid, but worth it)

---

## Quick Win: Get 5 Backlinks This Week

1. **FNCCI**: Apply for membership, get listed
2. **Nepal Chamber of Commerce**: List your business
3. **Local news**: Send press release about your services
4. **Trade blogs**: Comment with website link
5. **Business forums**: Participate and add signature with link

---

## This Week's Priorities

- [ ] Google Search Console verification
- [ ] Google Business Profile setup
- [ ] Submit sitemap.xml
- [ ] Request indexing for 5 main pages
- [ ] Add to 5 Nepal business directories
- [ ] Get 5 customer reviews on Google
- [ ] Create Facebook Business Page
- [ ] Create LinkedIn Company Page
- [ ] Post first content on social media
- [ ] Send review request emails to past customers

**Time needed**: 4-6 hours total

**Result**: Website will be indexed and start appearing in Google searches within 1-2 weeks!

---

## Contact for Verification Codes

Once you complete these steps, you'll need:
1. Google Search Console verification code → Add to index.html
2. Google Analytics Measurement ID → Add to index.html

Let me know when you have these and I'll add them to the code!
