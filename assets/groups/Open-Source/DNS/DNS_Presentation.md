---
tags: [open-source, dns, presentation, cascade-steam]
cssclasses: [slides]
---

<!-- Obsidian Slides — use the Slides core plugin to present -->

# DNS
## More Than Just a Lookup Table

Domain Name System — A deep dive into the internet's phone book, directory, security layer, and so much more.

*Cascade STEAM — Technology Education Series*

---

## What We'll Cover Today

| # | Topic | Summary |
|---|-------|---------|
| 01 | What is DNS? | The basics — names, IPs, and why we need it |
| 02 | How DNS Works | Recursive resolvers, root servers, authoritative DNS |
| 03 | Forward & Reverse DNS | A/AAAA records vs PTR lookups |
| 04 | DNS Record Types | SOA, NS, A, AAAA, CNAME, MX, TXT, SRV, PTR, CAA, and more |
| 05 | DNS in the Wild | Email routing, service discovery, security, anti-spam |
| 06 | DNS Security | DNSSEC, DoH, DoT — protecting the lookup chain |

---

# 01 — What is DNS?

*The basics — names, IPs, and the phone book of the internet*

---

## The Problem DNS Solves

**Without DNS**
- You'd need to memorize: `142.250.80.46`
- Every website needs an IP address
- IPs change when servers move
- No meaningful names — just numbers

**With DNS**
- You type: `google.com`
- DNS translates name → IP silently
- Servers can change IPs, names stay the same
- Human-readable, memorable, hierarchical

> DNS: translating 142.250.80.46 into google.com since 1983 (RFC 882/883 → RFC 1034/1035)

---

## How a DNS Lookup Works

```
🖥️ Your Browser  →  🔄 Recursive Resolver  →  🌍 Root NS  →  📂 .org TLD  →  ✅ Authoritative DNS
```

1. **Your Browser** — You type `cascadesteam.org`
2. **Recursive Resolver** — Your ISP or `8.8.8.8` does the heavy lifting
3. **Root Name Server** — Directs to `.org` TLD servers
4. **.org TLD Server** — Directs to authoritative DNS for `cascadesteam.org`
5. **Authoritative DNS** — Returns the actual IP address!

`cascadesteam.org → 143.198.x.x`

> ⚡ **Caching & TTL:** Cached answers skip steps 3–5 — making DNS sub-millisecond for warm queries.

---

# 02 — DNS Record Types

*The Building Blocks — every record has a job*

---

## Address Records: A, AAAA & CNAME

### `A` — Address Record (IPv4)
`hostname → IP address`
Maps a hostname to a 32-bit IPv4 address. Multiple A records = round-robin load balancing.
```
cascadesteam.org.  A  143.198.56.78
```

### `AAAA` — IPv6 Address Record
Maps a hostname to a 128-bit IPv6 address. Modern dual-stack systems have both.
```
cascadesteam.org.  AAAA  2600:1f18::1
```

### `CNAME` — Canonical Name Record
Creates an alias pointing to another hostname. Cannot be used at the zone apex.
```
www.example.com.  CNAME  example.com.
```

---

## Mail & Text Records: MX and TXT

### `MX` — Mail Exchanger
Priority-based mail server routing. Lower number = higher priority.
```
example.com.  10  mail1.example.com.   ← primary
example.com.  20  mail2.example.com.   ← backup
example.com.  30  mail3.example.com.   ← tertiary
```

### `TXT` — Text Record (Swiss Army Knife)

| Type | Purpose | Example |
|------|---------|---------|
| SPF | Authorized sending servers | `v=spf1 include:_spf.google.com ~all` |
| DKIM | Public key for email signatures | `v=DKIM1; k=rsa; p=MIGfMA0...` |
| DMARC | Email authentication policy | `v=DMARC1; p=reject; rua=mailto:...` |
| Verify | Domain ownership | `google-site-verification=abc123` |

---

## Zone Control Records: SOA and NS

### `SOA` — Start of Authority
Every DNS zone has exactly one. Contains: primary NS, admin email, serial, timers.
```
cascadesteam.org.  SOA
  ns1.hover.com.  dns.hover.com.
  2024040201  ; serial
  3600        ; refresh
```

### `NS` — Name Server
Delegates authority for a zone to specific name servers. Min 2 for redundancy.
```
cascadesteam.org.  NS  ns1.hover.com.
cascadesteam.org.  NS  ns2.hover.com.
```

**DNS Delegation Chain:** `. (Root)` → `.org TLD` → `cascadesteam.org` → `ns1/ns2.hover.com`

---

## Reverse DNS: PTR Records

### `PTR` — Pointer Record

```
Forward (A):     mail.example.com  →  203.0.113.42
Reverse (PTR):   42.113.0.203.in-addr.arpa  →  mail.example.com
```

**Why PTR Records Matter:**
- **Email Deliverability** — No PTR = spam or rejection
- **Network Troubleshooting** — `traceroute` shows hostnames not raw IPs
- **Log Readability** — Human-readable server logs
- **Security Verification** — IDS and financial systems require matching forward+reverse

---

## Service Discovery: SRV Records

### `SRV` — Service Locator
Format: `_service._protocol.name.  TTL  IN  SRV  priority  weight  port  target`
```
_xmpp-client._tcp.jabber.org.  86400  IN  SRV  5  50  5222  xmpp1.jabber.org.
```

| Field | Meaning |
|-------|---------|
| `_service` | Protocol (_xmpp, _sip, _ldap, _kerberos) |
| `priority` | Lower = tried first (failover) |
| `weight` | Load balancing between equal-priority records |
| `port` | TCP/UDP port the service listens on |

*Used by: XMPP, SIP/VoIP, LDAP, Active Directory, Minecraft, Kubernetes*

---

## More Record Types Worth Knowing

| Record | Purpose | Example |
|--------|---------|---------|
| `CAA` | Which CAs may issue TLS certs | `0 issue "letsencrypt.org"` |
| `NAPTR` | VoIP phone number → URI | `10 10 "u" "E2U+sip" ...` |
| `TLSA` | TLS cert pin via DNS (DANE) | `3 1 1 abc123...` |
| `HINFO` | Host CPU/OS info (legacy) | `"x86-64" "Linux"` |
| `LOC` | GPS coordinates (RFC 1876) | `48 44 N 122 28 W 60m` |
| `SSHFP` | SSH host key fingerprint | `2 1 7491973e...` |

---

# 03 — DNS in the Wild

*Real-world uses — email, services, and beyond*

---

## Email Anti-Spam Trio: SPF + DKIM + DMARC

**Email Journey:** `📧 SEND` → `SPF?` → `DKIM?` → `DMARC?` → `✓ DELIVER` or `✗ BLOCK`

### SPF — Sender Policy Framework
```
v=spf1 include:_spf.google.com ip4:203.0.113.0/24 ~all
```
Lists all servers authorized to send from your domain. Soft fail `~all` or hard fail `-all`.

### DKIM — DomainKeys Identified Mail
```
selector1._domainkey.example.com.  TXT  "v=DKIM1; k=rsa; p=MIGfMA0..."
```
Mail server signs emails with private key; public key in DNS for recipient verification.

### DMARC — Domain-based Message Auth
```
_dmarc.example.com.  TXT  "v=DMARC1; p=reject; rua=mailto:dmarc@example.com"
```
`p=reject` = unauthenticated email dropped entirely + aggregate reports sent back.

---

# 04 — DNS Security

*Protecting the lookup chain — DNSSEC, DoH, DoT*

---

## DNS Security: DNSSEC, DoH, and DoT

> ⚠️ **Before:** `🔓` DNS query (UDP:53) — visible to anyone on the network
> ✅ **After:**  `🔒` Encrypted tunnel (port 443/853) — only resolver sees queries

### DNSSEC — DNS Security Extensions
- Digital signatures on all DNS records — chain of trust root → TLD → zone
- Does **NOT** encrypt traffic — just signs it to prevent tampering

### DoH — DNS over HTTPS (RFC 8484)
- DNS inside HTTPS on port 443 — looks like normal web traffic, hard to block
- Supported by Firefox, Chrome, Windows 11

### DoT — DNS over TLS (RFC 7858)
- DNS inside TLS on port 853 — visible to network admins, preferred in enterprise
- Android 9+ "Private DNS" feature uses DoT

---

## DNS Record Quick Reference

| Record | Purpose | Key Info | Example |
|--------|---------|----------|---------|
| `A` | Name → IPv4 | Most fundamental | `203.0.113.42` |
| `AAAA` | Name → IPv6 | 128-bit, dual-stack | `2001:db8::1` |
| `CNAME` | Alias → Name | No zone apex | `www → example.com.` |
| `MX` | Email routing | Lower priority = first | `10 mail.example.com.` |
| `TXT` | Arbitrary text | SPF, DKIM, DMARC | `v=spf1 include:... ~all` |
| `SOA` | Zone authority | One per zone | `ns1. admin. 20240401 ...` |
| `NS` | Authoritative servers | Min 2 recommended | `ns1.hover.com.` |
| `PTR` | IP → Name | IP block owner | `42.113.0.203.in-addr.arpa` |
| `SRV` | Service discovery | Priority, weight, port | `_xmpp._tcp 5 50 5222 host.` |
| `CAA` | CA authorization | SSL cert control | `0 issue "letsencrypt.org"` |
| `SSHFP` | SSH fingerprint | Needs DNSSEC | `2 1 7491973e5f8b39...` |
| `TLSA` | TLS cert pin | DANE validation | `3 1 1 abc123def456...` |

---

## Key Takeaways

1. **DNS is infrastructure** — Every internet connection depends on DNS.
2. **Records have specific jobs** — A/AAAA serve IPs, MX routes email, SRV discovers services.
3. **DNS powers email security** — SPF, DKIM, and DMARC are all DNS-based.
4. **DNS is increasingly secure** — DNSSEC signs records, DoH/DoT encrypt queries.
5. **TTL controls propagation** — Plan change windows around TTL values.

### Go Further
- RFC 1034/1035 — DNS specification  |  RFC 1912 — Common DNS errors
- IANA DNS Parameters  |  [MXToolbox](https://mxtoolbox.com)
- [dnsviz.net](https://dnsviz.net) — DNSSEC visualization
- Tools: `dig`, `nslookup`, `drill`  |  Pi-hole for DNS filtering

---

*Questions? — cascadesteam.org*
