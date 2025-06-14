# Sumrise Spend Analyzer MVP - TODO Checklist

---

## Step 1: Project Setup & Infrastructure

- [x] Initialize Git repository
- [x] Create `docker-compose.yml` with:
  - [x] SvelteKit app container
  - [x] PocketBase container with persistent volume
  - [x] Nginx reverse proxy container
- [x] Generate self-signed SSL certificates (mkcert or OpenSSL)
- [x] Configure nginx with SSL for domains:
  - [x] `sumrise.test` → frontend
  - [x] `pocketbase.test` → API backend
- [x] Set up Docker network for internal communication
- [x] Verify all containers run and communicate correctly

---

## Step 2: PocketBase Schema Design

- [x] Define `raw_emails` collection with fields:
  - [x] id (auto UUID)
  - [x] text_body (text)
  - [x] received_date (date/time)
  - [x] status (select: `queued`, `processing`, `failed`, `processed`)
  - [x] error_msg (nullable text)
  - [x] retry_count (integer, default 0)
- [x] Define `transactions` collection with fields:
  - [x] id (auto UUID)
  - [x] date (timestamp integer)
  - [x] amount_cents (integer)
  - [x] merchant_name (string)
  - [x] card_type (string)
  - [x] card_last4 (string)
  - [x] category (string, default "Uncategorized")
  - [x] location (string, optional)
  - [x] raw_email_id (relation to `raw_emails`)
- [x] Create migration script or export JSON schema
- [x] Verify collections in PocketBase admin UI
- [x] Add seed data to pocketbase

---

## Step 3: API Endpoints

### 3.1 POST `/api/transactions` webhook endpoint

- [x] Implement SvelteKit POST API route `/api/transactions`
- [x] Validate JSON payload (`TextBody`, `Date`)
- [x] Connect to PocketBase using environment variable
- [x] Insert new `raw_emails` record with `queued` status
- [x] Return success or validation error responses

### 3.2 GET `/api/transactions` endpoint

- [x] Implement SvelteKit GET API route `/api/transactions`
- [x] Support query parameters: `month`, `year`, `page`, `pageSize`
- [x] Query PocketBase for transactions filtered by date

---

## Step 4: Email Parsing Logic

Parsing setup is done on the email inbound processor.

---

## Step 5: Scheduled Processing (Cron Job)

- [x] Implement PocketBase JSVM cron job running every 5 minutes
- [x] Cron job to:
  - [x] Process queued emails
  - [x] Retry `failed` emails with `retry_count` < 3
  - [x] Implement exponential backoff logic for retries
- [x] Update statuses and logs accordingly

---

## Step 7: Frontend UI - Dashboard

- [x] Create SvelteKit page `/`
- [x] Implement month/year dropdown selectors
- [x] Fetch and display transactions filtered by selected date
- [x] Display summary statistics (total spend, transaction count, avg spend)

---

## Step 8: Frontend UI - Failed Transactions

- [x] Create SvelteKit page `/failed`
- [x] List failed `raw_emails` with columns:
  - [x] ID
  - [x] Received date
  - [x] Error message
- [x] Add buttons/actions:
  - [x] View JSON details modal
  - [x] Retry (reset status to `queued`)

---

## Step 9: Groq API Integration

- [x] Send email text to Groq API for extraction
- [x] Add record to transactions collection

---

## Step 10: Error Handling & UX Improvements

- [x] Improve retry logic with timestamp-based exponential backoff
- [x] Display clear status indicators in UI (queued, processing, failed, processed)

---

## Step 11: Testing & Documentation

- [ ] Write unit tests for parsing functions
- [ ] Write integration tests for API endpoints and processing job
- [ ] Manual end-to-end test of flow (email → webhook → processing → dashboard)
- [ ] Document:
  - [ ] Environment setup
  - [ ] Docker Compose usage
  - [ ] API specs
  - [ ] Developer workflow
- [ ] Prepare README with installation and usage instructions

---

# Optional Enhancements (Future)

- [ ] Add user authentication / multi-user support
- [ ] Categorization suggestions / auto-tagging
- [ ] Export transaction data (CSV, JSON)
- [ ] Advanced analytics dashboard
- [ ] Mobile-friendly responsive UI
- [ ] Email forwarding integration / automated webhook triggers

---

# Notes

- Track progress on each subtask by marking the checkbox `[x]`.
- Break down any large tasks into smaller ones as needed.
- Regularly commit code and push to remote repository.
- Use environment variables securely for sensitive data.
