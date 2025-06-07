routerAdd("POST", "/hook", async (e) => {
    /* 
    // Example of request body
    {"MessageID":"26261337-a662-eeee-907b-bebd3e25a476","Date":"Sat, 31 May 2025 00:52:04 -0400","TextBody":"Dear User,\n\nYou've recently made a purchase with your BANK Dividend Platinum Visa card\nending in NNNN for $35.31 at DOLLARAMA # 001.\nYou can sign on to your BANK Online or Mobile Banking\n to view more details about\nthis transaction.\n"}
    */
    const body = JSON.parse(toString(e.request.body));
    const { MessageID, Date: _date, TextBody } = body;


    let collection = $app.findCollectionByNameOrId("raw_emails")
    let record = new Record(collection)
    // Convert Unix timestamp to ISO date string
    record.set('received_date', new Date(_date).toISOString())
    record.set('text_body', TextBody)
    record.set('message_id', MessageID)
    record.set('status', 'queued')
    $app.save(record)

    return e.json(200, { success: true });
});

routerAdd("GET", "/ping", (e) => {
    return e.json(200, { message: "pong" });
});

onBootstrap((e) => {
    console.log("PB Ready")
    e.next()
})

cronAdd("raw_email_cron", "*/1 * * * *", () => {
    console.log("cronAdd raw_emails")
    const SYSTEM_PROMPT = `
        You are a specialized transaction data extraction assistant. Your task is to analyze email text and extract structured transaction information.

        Extract the following fields from the email text:
        1. date: Transaction date as Unix timestamp (seconds since epoch)
        2. amount_cents: Transaction amount in cents (integer, no decimal points)
        3. merchant_name: Clean merchant name (remove store numbers, locations, etc.)
        4. card_type: Type of card used (e.g., "Visa", "MasterCard", "American Express")
        5. card_last4: Last 4 digits of the card number
        6. category: Always set to "Uncategorized"
        7. location: Optional location of transaction (if available)

        Rules for extraction:
        - All amounts should be converted to cents (multiply by 100)
        - Dates should be converted to Unix timestamps (seconds)
        - Merchant names should be cleaned (remove store numbers, locations)
        - Card types should be standardized (e.g., "Visa", "MasterCard")
        - Always set category to "Uncategorized"
        - Location is optional, include only if clearly stated

        If any required field cannot be extracted, return an error message explaining what could not be found.

        Return EXACTLY this JSON format and nothing else:
        {
            "date": 1234567890,
            "amount_cents": 1000,
            "merchant_name": "Example Store",
            "card_type": "Visa",
            "card_last4": "1234",
            "category": "Uncategorized",
            "location": "Optional Location"
        }
        `

    const record = $app.findFirstRecordByFilter(
        "raw_emails",
        "status = 'queued'",
    )
    if (record) {
        record.set('status', 'processing')
        const originalDate = record.get('received_date')
        $app.save(record)

        try {
            const res = $http.send({
                url: "https://api.groq.com/openai/v1/chat/completions",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + process.env.GROQ_API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "llama-3.1-8b-instant",
                    "messages": [{
                        "role": "system",
                        "content": SYSTEM_PROMPT
                    }, {
                        "role": "user",
                        "content": `${JSON.stringify(record)}`
                    }]
                }),
                timeout: 120,
            })


            if (!res.json) {
                throw new Error("No JSON response from Groq API")
            }

            if (!res.json.choices || !res.json.choices[0] || !res.json.choices[0].message) {
                throw new Error("Invalid response format from Groq API: " + JSON.stringify(res.json))
            }

            const responseContent = res.json.choices[0].message.content;
            const data = JSON.parse(responseContent);

            if (data.amount_cents && data.merchant_name && data.card_type && data.card_last4) {
                const collection = $app.findCollectionByNameOrId("transactions")
                let transactionRow = new Record(collection)
                transactionRow.set('raw_email_id', record.id)
                // LLMs hallucinate dates, so we use the original date
                transactionRow.set('date', originalDate)
                transactionRow.set('amount_cents', data.amount_cents)
                transactionRow.set('merchant_name', data.merchant_name)
                transactionRow.set('card_type', data.card_type)
                transactionRow.set('card_last4', data.card_last4)
                transactionRow.set('category', data.category)
                transactionRow.set('location', data.location)

                $app.save(transactionRow)
                record.set('status', 'processed')
            } else {
                record.set('status', 'failed')
                record.set('error_msg', `Missing required fields in parsed data: ${data}`)
            }
        } catch (error) {
            console.log("Error processing record:", record.id, error)
            record.set('status', 'failed')
            record.set('error_msg', 'Error: ' + error.message)
        }
        $app.save(record)
    }
})