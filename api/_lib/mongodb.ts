import { Db, MongoClient } from 'mongodb'

const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not configured.')
  }

  if (!globalForMongo._mongoClientPromise) {
    const client = new MongoClient(uri)
    globalForMongo._mongoClientPromise = client.connect()
  }

  return globalForMongo._mongoClientPromise
}

export async function getDatabase(): Promise<Db> {
  const client = await getClientPromise()
  return client.db('blvrsdb')
}
