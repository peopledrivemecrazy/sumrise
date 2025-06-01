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
  - [x] `api.sumrise.test` → API backend
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

---

## Step 3: API Endpoints

### 3.1 POST `/api/transactions` webhook endpoint

- [ ] Implement SvelteKit POST API route `/api/transactions`
- [ ] Validate JSON payload (`TextBody`, `Date`)
- [ ] Connect to PocketBase using environment variable
- [ ] Insert new `raw_emails` record with `queued` status
- [ ] Return success or validation error responses

### 3.2 GET `/api/transactions` endpoint

- [ ] Implement SvelteKit GET API route `/api/transactions`
- [ ] Support query parameters: `month`, `year`, `page`, `pageSize`
- [ ] Query PocketBase for transactions filtered by date
- [ ] Implement pagination logic
- [ ] Return total count and paginated transaction list

---

## Step 4: Email Parsing Logic

- [ ] Write stub `parseEmailText(text: string)` function returning dummy transaction data
- [ ] Test stub parser with sample email text inputs

---

## Step 5: Email Processing Job

- [ ] Write `processQueuedEmails()` function that:
  - [ ] Fetches `raw_emails` with status `queued`
  - [ ] Parses email text using `parseEmailText`
  - [ ] Inserts processed transaction records
  - [ ] Updates `raw_emails` status to `processed`
  - [ ] Handles errors, marking `failed` and incrementing `retry_count`
- [ ] Add detailed logging for processing

---

## Step 6: Scheduled Processing (Cron Job)

- [ ] Implement PocketBase JSVM cron job running every 5 minutes
- [ ] Cron job to:
  - [ ] Process queued emails
  - [ ] Retry `failed` emails with `retry_count` < 3
  - [ ] Implement exponential backoff logic for retries
- [ ] Update statuses and logs accordingly

---

## Step 7: Frontend UI - Dashboard

- [ ] Create SvelteKit page `/`
- [ ] Implement month/year dropdown selectors
- [ ] Fetch and display transactions filtered by selected date
- [ ] Display summary statistics (total spend, transaction count, avg spend)
- [ ] Implement paginated table with:
  - [ ] Date
  - [ ] Merchant
  - [ ] Amount
  - [ ] Card Type
  - [ ] Category
- [ ] Add pagination controls

---

## Step 8: Frontend UI - Failed Transactions

- [ ] Create SvelteKit page `/failed`
- [ ] List failed `raw_emails` with columns:
  - [ ] ID
  - [ ] Received date
  - [ ] Error message
- [ ] Add buttons/actions:
  - [ ] View JSON details modal
  - [ ] Retry (reset status to `queued`)
  - [ ] Delete record
  - [ ] Edit category and mark as processed
- [ ] Implement confirmation dialogs
- [ ] Provide UI feedback for actions

---

## Step 9: Groq API Integration

- [ ] Replace stub parser with real Groq API call
- [ ] Send email text to Groq API for extraction
- [ ] Parse Groq API response to transaction model
- [ ] Handle Groq API errors and rate limiting
- [ ] Update processing function to use Groq parser

---

## Step 10: Error Handling & UX Improvements

- [ ] Improve retry logic with timestamp-based exponential backoff
- [ ] Display clear status indicators in UI (queued, processing, failed, processed)
- [ ] Add loading spinners and error notifications in frontend
- [ ] Validate manual edits (category only, once-only edits)
- [ ] Add success/failure feedback on retry and delete actions

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
