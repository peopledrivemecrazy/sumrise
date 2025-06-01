migrate((app) => {
  // Create raw_emails collection
  let rawEmails = new Collection({
    name: "raw_emails",
    type: "base",
    schema: [
      { name: "text_body", type: "text", required: true, options: {} },
      { name: "received_date", type: "date", required: true, options: {} },
      { name: "status", type: "select", required: true, options: { maxSelect: 1, values: ["queued", "processing", "failed", "processed"] } },
      { name: "error_msg", type: "text", required: false, options: {} },
      { name: "retry_count", type: "number", required: true, options: { min: 0, max: null, noDecimal: true } }
    ],
    options: {}
  });
  app.save(rawEmails);

  // Create transactions collection
  let transactions = new Collection({
    name: "transactions",
    type: "base",
    schema: [
      { name: "date", type: "date", required: true, options: {} },
      { name: "amount_cents", type: "number", required: true, options: { noDecimal: true } },
      { name: "merchant_name", type: "text", required: true, options: {} },
      { name: "card_type", type: "text", required: true, options: {} },
      { name: "card_last4", type: "text", required: true, options: {} },
      { name: "category", type: "text", required: true, options: {} },
      { name: "location", type: "text", required: false, options: {} },
      { name: "raw_email_id", type: "relation", required: true, options: { collectionId: "raw_emails", cascadeDelete: false, minSelect: 1, maxSelect: 1, displayFields: [] } }
    ],
    options: {}
  });
  app.save(transactions);
}, (app) => {
  let transactions = app.findCollectionByNameOrId("transactions");
  if (transactions) app.delete(transactions);
  let rawEmails = app.findCollectionByNameOrId("raw_emails");
  if (rawEmails) app.delete(rawEmails);
}); 