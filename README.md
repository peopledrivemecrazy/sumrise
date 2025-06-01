# Sumrise Spend Analyzer - Developer Specification (MVP)

---

## Overview

**Sumrise** is a personal spend analyzer tool that parses credit card and banking transaction emails forwarded to an inbound processor. It extracts transaction data asynchronously and displays monthly expenditure summaries and transaction lists in a simple dashboard.

---

## Architecture

- **Frontend:**  
  - SvelteKit + Tailwind CSS  
  - Server routes only (no client-side API calls)  
  - Displays transaction tables and summary statistics by calendar month  
  - Pagination handled by ag-Grid (or simple tables if too complex)  

- **Backend/Data:**  
  - PocketBase (SQLite-based embedded DB) for:  
    - Storing raw inbound email data (queued jobs)  
    - Storing parsed transactions  
    - Job queue & scheduled retry logic via PocketBase JSVM cronAdd  
  - Processing pipeline triggered via webhook from inbound email processor  
  - Use Groq API (free) with rate limit handling for LLM parsing  
  - Docker Compose stack includes:  
    - SvelteKit app container  
    - PocketBase container  
    - Nginx container with local domains (`sumrise.test`, `pocketbase.test`) and self-signed certs (mkcert or OpenSSL)  

---

## Data Flow

1. **Inbound Email Forwarded** to Inbound Processor →  
2. Processor sends **webhook POST** to `/api/transactions` endpoint with:  
   - `TextBody` (email content)  
   - `Date` (email received date)  
3. Webhook handler:  
   - Stores raw email + metadata as a **queue item** in PocketBase  
4. Scheduled job (via PocketBase cron):  
   - Picks items from queue asynchronously  
   - Sends text body to Groq LLM for extracting:  
     - Date of transaction (timestamp)  
     - Amount (integer, cents, single currency assumed - CAD)  
     - Merchant name (cleaned, strip store numbers)  
     - Card type / last 4 digits  
     - Category (default "Uncategorized", no auto or manual categorization allowed in MVP)  
     - Location (optional)  
   - If parsing successful:  
     - Store transaction in main transactions collection  
     - Mark queue item processed and remove from queue  
   - If parsing fails:  
     - Retry up to 3 times with exponential backoff  
     - After 3 failures, mark queue item failed and expose in failed transactions page  

---

## Data Models

### Transaction (processed)
| Field          | Type       | Notes                        |
|----------------|------------|------------------------------|
| id             | UUID       | Primary key                  |
| date           | Integer    | Timestamp (seconds)          |
| amount_cents   | Integer    | Amount in cents (CAD)        |
| merchant_name  | String     | Cleaned merchant name        |
| card_type      | String     | E.g., Visa, MasterCard       |
| card_last4     | String     | Last 4 digits                |
| category       | String     | "Uncategorized" (MVP)        |
| location       | String     | Optional                    |
| raw_email_id   | UUID       | FK to raw email record       |

### Raw Email / Queue Item
| Field          | Type       | Notes                        |
|----------------|------------|------------------------------|
| id             | UUID       | Primary key                  |
| text_body      | Text       | Full email body              |
| received_date  | ISO Date   | Email received timestamp     |
| status         | Enum       | `queued`, `processing`, `failed`, `processed` |
| error_msg      | String     | Parsing error if any         |
| retry_count    | Integer    | Incremented on failures      |

---

## UI / UX

- **Dashboard main view:**  
  - Show total spend, number of transactions, average spend per transaction by selected month  
  - Dropdown date picker for selecting **month/year** (no range)  
  - Transactions listed newest first  
  - Table shows:  
    - Date (formatted DD-MM-YYYY)  
    - Merchant name  
    - Amount (formatted with `$` sign, thousands separators)  
    - Card type/last 4 digits  
    - Category (always "Uncategorized")  
  - Pagination handled by ag-Grid or fallback simple pagination

- **Failed Transactions page:**  
  - List of failed raw email items with columns:  
    - Transaction ID (UUID)  
    - Date (raw/parsed)  
    - Merchant name (if parsed)  
    - Amount (formatted or raw)  
    - Error message (truncated with `...`, expandable modal)  
  - Actions per item:  
    - View JSON (full raw email + metadata)  
    - Retry processing (resets status and puts back in queue)  
    - Delete item  
    - Edit transaction fields (only category allowed, once only) → marks as processed and moves to main list permanently with no rollback

- **Initial state:**  
  - Show “No data yet, waiting for first email” message if no transactions

---

## Error Handling

- Failed parsing retried automatically up to 3 times (exponential backoff via PocketBase cron jobs)  
- After 3 failures, item marked failed and exposed for manual retry/edit/delete  
- Manual edit of failed items only allows setting category once, then moves item to processed with no rollback  
- No duplicate transactions expected (one email = one transaction guaranteed by mail forwarding provider)  
- Show "Processing" status for queue items currently being processed  
- No alerts or notifications in MVP

---

## Security & Access

- Single user, no login, local only  
- Runs locally in Docker with internal network and local domain names via nginx reverse proxy  
- No storage of emails outside local DB (PocketBase)  
- Emails discarded after parsing; raw bodies only stored temporarily for queueing and troubleshooting  
- No OAuth or external login flows

---

## Deployment

- Docker Compose with 3 containers: `sumrise_app`, `pocketbase`, `nginx`  
- Self-signed SSL certs auto-generated (mkcert/OpenSSL) and mounted in nginx container  
- Services communicate internally by service name; ports exposed only by nginx proxy  
- Local directory mounts for code, data, certs, and config  

---

## Testing Plan

### Unit Tests

- Parsing function isolated and tested with sample transaction emails  
- Data validation tests for extracted fields (date, amount, UUID)  
- UI components (date picker, tables) render correct data and formatting  

### Integration Tests

- Webhook endpoint accepts POST with sample email payload, stores queue item  
- Cron job picks queued items and processes correctly with mocked Groq API  
- Retry logic triggers on failure, stops after 3 attempts  
- Failed transactions page renders failed items, retry/delete/edit functions work  

### Manual Tests

- Forward real sample emails to inbound processor and confirm transaction appears on dashboard  
- Check formatting of amounts, dates, pagination, sorting  
- Simulate parsing failures and verify retry and failed transaction UI  
- Verify editing category on failed item moves to main transaction list  

---

## Future Extensions (Not MVP)

- User login & multi-user support  
- Auto categorization & user corrections  
- Alerts & spending notifications  
- Export to PDF/XLS  
- Real-time UI updates with PocketBase subscriptions  
- Multi-currency support  
- OAuth integration for bank/email providers

---

# End of Specification

