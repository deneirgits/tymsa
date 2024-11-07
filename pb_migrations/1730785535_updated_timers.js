/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f4a8pnec5i5ui0r")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "anuzhxqw",
    "name": "previous_timer",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "f4a8pnec5i5ui0r",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f4a8pnec5i5ui0r")

  // remove
  collection.schema.removeField("anuzhxqw")

  return dao.saveCollection(collection)
})
