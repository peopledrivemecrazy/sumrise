migrate((app) => {
    let superusers = app.findCollectionByNameOrId("_superusers")

    let record = new Record(superusers)

    // note: the values can be eventually loaded via $os.getenv(key)
    // or from a special local config file
    record.set("email", process.env.SUPER_ADMIN_USER)
    record.set("password", process.env.SUPER_ADMIN_PASSWORD)

    app.save(record)
}, (app) => { // optional revert operation
    try {
        let record = app.findAuthRecordByEmail("_superusers", process.env.SUPER_ADMIN_USER)
        app.delete(record)
    } catch {
        // silent errors (probably already deleted)
    }
})