import mongoose from 'mongoose';

export async function connectDB(mongoUri) {
  const uri = mongoUri || process.env.MONGO_URI;
  if (!uri) throw new Error('Missing MONGO_URI');

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    autoIndex: true,
  });

  return mongoose.connection;
}

