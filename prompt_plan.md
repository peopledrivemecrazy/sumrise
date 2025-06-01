# Step-by-step Blueprint & Iterative Breakdown for Sumrise Spend Analyzer MVP

## Step 1: Project Setup & Infrastructure

- Initialize a Git repo for the project
- Setup Docker Compose skeleton with three containers:

  - SvelteKit app container
  - PocketBase container
  - Nginx reverse proxy container with local domain config (`sumrise.test`, `api.sumrise.test`) and self-signed certs

- Configure network and volume mounts for persistence
- Verify all containers run and communicate internally

---

## Step 2: PocketBase Schema Design

- Define collections and fields in PocketBase:

  - `raw_emails` (queue items): id, text_body, received_date, status, error_msg, retry_count
  - `transactions`: id, date, amount_cents, merchant_name, card_type, card_last4, category, location, raw_email_id

- Create initial records manually or via migration script
- Connect PocketBase admin UI to inspect data

---

## Step 3: SvelteKit API & Basic Endpoints

- Implement `/api/transactions` POST webhook endpoint:

  - Accept JSON with `TextBody` and `Date` fields
  - Validate input and insert a new `raw_emails` queue item in PocketBase with status `queued`
  - Return success or validation error JSON

- Implement GET endpoint `/api/transactions` to fetch processed transactions filtered by month/year with pagination

---

## Step 4: Email Parsing Logic (Stub & Integration)

- Write a parsing stub function for the email text body to extract: date, amount, merchant name, card info, etc.
- For now, parse simple static samples or regex, returning dummy structured data
- Implement a processing function that reads queued items from PocketBase, calls parsing, and inserts processed transactions
- Mark processed queue items as `processed` or failed with error message

---

## Step 5: Scheduled Processing (Cron Job)

- Configure PocketBase JSVM `cronAdd` to schedule a processing job every 5 minutes (or configurable)
- The cron job:

  - Queries `raw_emails` with status `queued` or `failed` with retry_count < 3
  - Runs parsing & processing function on them
  - Handles exponential backoff delays (simple timestamp-based logic)
  - Updates queue item status & retry count accordingly

---

## Step 6: Frontend UI - Dashboard (Transactions List & Summary)

- Create a SvelteKit page for the main dashboard at `/`
- Implement a month/year selector dropdown
- Query `/api/transactions` with selected month/year to fetch processed transactions
- Display summary statistics: total spend, number of transactions, average spend
- Show paginated transaction table with columns: date, merchant, amount, card, category
- Implement pagination controls (either via ag-Grid or native table with buttons)

---

## Step 7: Frontend UI - Failed Transactions Page

- Add a route `/failed` to list failed `raw_emails` queue items
- Display columns: id, raw date, merchant (if parsed), amount, error message
- Provide buttons for:

  - View JSON details in modal
  - Retry processing (reset status, clear error, reset retry_count)
  - Delete item
  - Edit transaction fields (category only), which moves item to processed

---

## Step 8: Groq API Integration for Parsing

- Replace stub parser with real Groq API call:

  - Send email text body to Groq API with prompt to extract fields
  - Parse Groq API JSON response into internal transaction model

- Handle Groq API errors, rate limits, and retries gracefully
- Update processing job to use Groq parser instead of stub

---

## Step 9: Error Handling & Robustness Improvements

- Improve retry logic with exponential backoff timestamps stored in PocketBase
- Display statuses properly in UI (queued, processing, failed, processed)
- Add manual edit form validation (only category, once-only edit)
- Add clear feedback on retry/delete actions in the UI
- Add loading states and error notifications on frontend

---

## Step 10: Final Testing & Documentation

- Write unit tests for parsing functions and API validation
- Write integration tests for webhook endpoint and processing job with mocks
- Manually test full flow: forward email → webhook → queue → processing → dashboard
- Document environment setup, Docker Compose usage, API specs, and developer workflow

---

# Iterative Breakdown into Smaller Chunks

| Step | Chunk Description                                                | Rough Size/Complexity | Notes                            |
| ---- | ---------------------------------------------------------------- | --------------------- | -------------------------------- |
| 1    | Setup Docker Compose + nginx + SvelteKit + PocketBase containers | Medium                | Includes self-signed certs       |
| 2    | Define PocketBase collections + fields                           | Small                 | Done via PocketBase UI or script |
| 3.1  | Implement `/api/transactions` POST webhook, store raw emails     | Small                 | Basic validation + insert        |
| 3.2  | Implement `/api/transactions` GET to fetch transactions          | Medium                | Pagination + filtering by month  |
| 4.1  | Write stub email parsing function                                | Small                 | Regex or fixed sample parsing    |
| 4.2  | Write processor function to convert raw email to transaction     | Medium                | Use stub parser, mark status     |
| 5    | Add PocketBase cron job for processing queued items              | Medium                | Retry logic + backoff            |
| 6.1  | Frontend dashboard layout with month/year selector               | Small                 | UI skeleton                      |
| 6.2  | Fetch & display transactions + summary                           | Medium                | Pagination + formatting          |
| 7    | Failed transactions UI + retry/delete/edit actions               | Medium                | Modal for JSON, forms            |
| 8    | Integrate Groq API parser                                        | Medium                | Replace stub, add error handling |
| 9    | Enhance error handling, UI feedback, manual edit validation      | Medium                | UX polish, retry states          |
| 10   | Testing + Documentation                                          | Medium                | Unit, integration, manual tests  |

---

# Further Breakdown of Step 3.1: POST webhook

- Create SvelteKit API route `/api/transactions` with POST method
- Parse JSON body, validate `TextBody` and `Date` fields presence and types
- Connect to PocketBase client (use env variable for URL)
- Insert new record into `raw_emails` collection with `queued` status
- Return JSON success response with new record ID
- Handle and return validation error JSON (400)

---

# Final Output: Series of Prompts for LLM to implement each chunk

---

```text
### Prompt 1: Setup Docker Compose Infrastructure

You are to create a Docker Compose configuration for the Sumrise Spend Analyzer MVP project.

Requirements:

- Three services:
  1. `sumrise_app`: Runs a SvelteKit app container with Node.js 18, serving on port 5173 internally.
  2. `pocketbase`: Official PocketBase container, storing data persistently in a mounted volume.
  3. `nginx`: Reverse proxy with SSL termination using self-signed certs, serving `sumrise.test` for frontend and `api.sumrise.test` for API.

- Use mkcert or OpenSSL to generate self-signed certificates, mounted into nginx.
- Network internal communication only; expose ports 80 and 443 via nginx.
- Provide docker-compose.yml and nginx.conf configurations.

Deliverables:

- docker-compose.yml file
- nginx.conf file
- Instructions on generating and mounting certificates

Please provide the full content of these configuration files.
```

---

```text
### Prompt 2: PocketBase Schema Setup

You are to define PocketBase collections and fields for Sumrise MVP:

Collections:

1. `raw_emails`
   - id: auto UUID
   - text_body: text
   - received_date: date/time
   - status: select [`queued`, `processing`, `failed`, `processed`]
   - error_msg: text (nullable)
   - retry_count: integer (default 0)

2. `transactions`
   - id: auto UUID
   - date: integer (timestamp seconds)
   - amount_cents: integer
   - merchant_name: string
   - card_type: string
   - card_last4: string
   - category: string (default "Uncategorized")
   - location: string (optional)
   - raw_email_id: relation to `raw_emails` (one-to-one)

Provide a PocketBase migration script or JSON export to import these collections and fields.
```

---

```text
### Prompt 3: Implement Webhook POST Endpoint `/api/transactions`

Implement a SvelteKit POST API route at `/api/transactions` with the following behavior:

- Accept JSON body with fields:
  - `TextBody` (string, required)
  - `Date` (ISO string or timestamp, required)

- Validate presence and types; respond with 400 and error message on invalid input.

- Connect to PocketBase using environment variable `POCKETBASE_URL`.

- Insert new record into `raw_emails` collection with:
  - `text_body` = `TextBody`
  - `received_date` = parsed
```

date from `Date`

- `status` = `"queued"`

- `retry_count` = 0

- Return JSON response `{ success: true, id: "<new_record_id>" }`.

- Handle and return appropriate HTTP errors.

Provide full SvelteKit handler code.

````

---

```text
### Prompt 4: Implement GET Endpoint `/api/transactions` with Filtering and Pagination

Implement a SvelteKit GET API route at `/api/transactions` with query parameters:

- `month` (1-12, optional, defaults to current month)
- `year` (4-digit, optional, defaults to current year)
- `page` (integer, optional, defaults to 1)
- `pageSize` (integer, optional, default 20)

Behavior:

- Fetch transactions from PocketBase `transactions` collection filtered by month/year on the `date` field.

- Return paginated JSON with:
  - `total` (total count)
  - `page`
  - `pageSize`
  - `transactions`: array of transactions with fields: date (ISO string), amount_cents, merchant_name, card_type, card_last4, category

Provide full SvelteKit handler code.
````

---

```text
### Prompt 5: Write Stub Email Parsing Function

Write a JavaScript function `parseEmailText(text: string)` that:

- Takes a raw email text string.
- Extracts dummy structured transaction data:
  - date (timestamp seconds)
  - amount_cents (integer)
  - merchant_name (string)
  - card_type (string)
  - card_last4 (string)
- For now, return fixed dummy data or extract using simple regex from sample input.

Export the function for use in processing.
```

---

```text
### Prompt 6: Implement Processing Function for Queued Emails

Write a Node.js function `processQueuedEmails()` that:

- Connects to PocketBase.
- Queries `raw_emails` collection for items with status `queued`.
- For each item:
  - Calls `parseEmailText` on `text_body`.
  - Inserts a new record in `transactions` with parsed data linked to raw_email_id.
  - Updates the raw_email status to `processed`.
- Handles and logs errors; updates status to `failed` and increments retry_count on error.

Export the function for later use in cron.
```

---

```text
### Prompt 7: Add PocketBase Scheduled Cron Job to Process Emails

Using PocketBase JSVM environment, write a cron job that:

- Runs every 5 minutes.
- Calls `processQueuedEmails()`.
- Handles retry logic for `failed` items with retry_count < 3.
- Uses exponential backoff for retries (simple timestamp comparison).
- Updates statuses accordingly.

Provide full cron job script compatible with PocketBase JSVM.
```

---

```text
### Prompt 8: Frontend Dashboard Page `/`

In SvelteKit, create a page at `/` that:

- Shows a month/year selector (dropdowns).
- Fetches transactions from `/api/transactions` based on selected month/year.
- Displays summary: total spend, count, average spend.
- Displays paginated table with columns: Date, Merchant, Amount, Card Type, Category.
- Includes pagination controls.

Provide full SvelteKit page code with client/server logic.
```

---

```text
### Prompt 9: Frontend Failed Transactions Page `/failed`

Create a SvelteKit page at `/failed` that:

- Lists `raw_emails` with status `failed`.
- Shows columns: id, received_date, error_msg.
- Includes buttons for:
  - Viewing JSON details in modal.
  - Retry (resets status to `queued`).
  - Delete.
  - Edit category and mark processed.
- Implements UI feedback and confirmation dialogs.

Provide full SvelteKit page code.
```

---

```text
### Prompt 10: Replace Stub Parser with Groq API Integration

Modify processing function to:

- Send `text_body` to Groq API with prompt to extract transaction data.
- Parse Groq JSON response into transaction fields.
- Handle API errors and retry.
- Update PocketBase records accordingly.

Provide updated processing function code with Groq API integration.
```

---

# Summary

- Follow the prompts sequentially for a smooth build process.
- Each prompt is self-contained but builds on previous outputs.
- I can help generate code for any prompt or chunk next.
