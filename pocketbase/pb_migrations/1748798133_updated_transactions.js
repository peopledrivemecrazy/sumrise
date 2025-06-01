/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3174063690")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number4216875057",
    "max": null,
    "min": null,
    "name": "amount_cents",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_718655618",
    "hidden": false,
    "id": "relation1452318234",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "raw_email_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3174063690")

  // remove field
  collection.fields.removeById("number4216875057")

  // remove field
  collection.fields.removeById("relation1452318234")

  return app.save(collection)
})
