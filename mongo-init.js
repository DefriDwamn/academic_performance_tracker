db = db.getSiblingDB('academic_tracker');

db.createUser({
  user: 'mongo_user',
  pwd: 'securepassword123',
  roles: [
    { role: 'readWrite', db: 'academic_tracker' },
    { role: 'dbAdmin', db: 'academic_tracker' }
  ]
});

db.test_collection.insertOne({ status: "initialized" });