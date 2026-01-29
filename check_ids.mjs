import mongoose from 'mongoose';

const DATABASE_URL = "mongodb+srv://softwareaitik_db_user:fO5hp4r5SS00kZHj@cluster0.6smgstp.mongodb.net/?appName=Cluster0";

async function run() {
    try {
        await mongoose.connect(DATABASE_URL);
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('COLLECTIONS:');
        collections.forEach(c => console.log(` - ${c.name}`));
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
  }
}

run();
