const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(process.env.DB_HOST, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize:100,
  minPoolSize:20,
});




async function connect(cb){

  try{
    await client.connect();
    const db=client.db('chess');
    cb(db);
  }

  catch(e){
    process.exit(1);
  }
}


module.exports={connect};





