/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_718655618")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "date2052627138",
    "max": "",
    "min": "",
    "name": "received_date",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select2063623452",
    "maxSelect": 1,
    "name": "status",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "queued",
      "processing",
      "failed",
      "processed"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_718655618")

  // remove field
  collection.fields.removeById("date2052627138")

  // remove field
  collection.fields.removeById("select2063623452")

  return app.save(collection)
})
