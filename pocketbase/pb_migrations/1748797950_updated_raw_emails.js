/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_718655618")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number2129530235",
    "max": 3,
    "min": 0,
    "name": "retry_count",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_718655618")

  // remove field
  collection.fields.removeById("number2129530235")

  return app.save(collection)
})
