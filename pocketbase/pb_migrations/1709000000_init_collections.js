migrate((app) => {
  // Create raw_emails collection with only text fields
  let rawEmails = new Collection({
    name: "raw_emails",
    type: "base",
    fields: [
      { name: "text_body", type: "text", required: true, options: {} },
      { name: "error_msg", type: "text", required: false, options: {} }
    ]
  });
  app.save(rawEmails);

  // Create transactions collection with only text fields
  let transactions = new Collection({
    name: "transactions",
    type: "base",
    fields: [
      { name: "merchant_name", type: "text", required: true, options: {} },
      { name: "card_type", type: "text", required: true, options: {} },
      { name: "card_last4", type: "text", required: true, options: {} },
      { name: "category", type: "text", required: true, options: {} },
      { name: "location", type: "text", required: false, options: {} }
    ]
  });
  app.save(transactions);
}, (app) => {
  let transactions = app.findCollectionByNameOrId("transactions");
  if (transactions) app.delete(transactions);
  let rawEmails = app.findCollectionByNameOrId("raw_emails");
  if (rawEmails) app.delete(rawEmails);
}); 