MongoDB

// insert:
db.mycol.insert({
   _id: ObjectId(7df78ad8902c),
   title: 'MongoDB Overview', 
   description: 'MongoDB is no sql database',
   by: 'tutorials point',
   url: 'http://www.tutorialspoint.com',
   tags: ['mongodb', 'database', 'NoSQL'],
   likes: 100
})

-------------------------

// select: 
db.mycol.find().pretty()

// select with Where Clause - AND
db.mycol.find({$and:[{"by":"tutorials point"},{"title": "MongoDB Overview"}]}).pretty() 

-- Output
{
   "_id": ObjectId(7df78ad8902c),
   "title": "MongoDB Overview", 
   "description": "MongoDB is no sql database",
   "by": "tutorials point",
   "url": "http://www.tutorialspoint.com",
   "tags": ["mongodb", "database", "NoSQL"],
   "likes": "100"
}

// select with Where Clause - OR
db.mycol.find({$or:[{"by":"tutorials point"},{"title": "MongoDB Overview"}]}).pretty()

-- Output
{
   "_id": ObjectId(7df78ad8902c),
   "title": "MongoDB Overview", 
   "description": "MongoDB is no sql database",
   "by": "tutorials point",
   "url": "http://www.tutorialspoint.com",
   "tags": ["mongodb", "database", "NoSQL"],
   "likes": "100"
}

------------------------

// select with AND - OR comnination
db.mycol.find({"likes": {$gt:10}, $or: [{"by": "tutorials point"},
   {"title": "MongoDB Overview"}]}).pretty()

-- Output
{
   "_id": ObjectId(7df78ad8902c),
   "title": "MongoDB Overview", 
   "description": "MongoDB is no sql database",
   "by": "tutorials point",
   "url": "http://www.tutorialspoint.com",
   "tags": ["mongodb", "database", "NoSQL"],
   "likes": "100"
}

---------------------------

// update :
db.COLLECTION_NAME.update(SELECTION_CRITERIA, UPDATED_DATA)
//Ex :
db.mycol.update({'title':'MongoDB Overview'},{$set:{'title':'New MongoDB Tutorial'}})

-----------------------------

// Delete
db.COLLECTION_NAME.remove(DELLETION_CRITTERIA)

-- Ex:
db.mycol.remove({'title':'MongoDB Overview'})

// Delete only One :
db.COLLECTION_NAME.remove(DELETION_CRITERIA,1)

// remove all document contents , is equal to truncate.
db.mycol.remove()

-------------------------------

