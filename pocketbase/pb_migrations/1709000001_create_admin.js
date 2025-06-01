
migrate((app) => {
    let superusers = app.findCollectionByNameOrId("_superusers")

    let record = new Record(superusers)

    // note: the values can be eventually loaded via $os.getenv(key)
    // or from a special local config file
    record.set("email", "admin@sumrise.test")
    record.set("password", "SUPER_SUPER_SUPER_ADMIN_PASSWORD_ENV")

    app.save(record)
}, (app) => { // optional revert operation
    try {
        let record = app.findAuthRecordByEmail("_superusers", "admin@sumrise.test")
        app.delete(record)
    } catch {
        // silent errors (probably already deleted)
    }
})