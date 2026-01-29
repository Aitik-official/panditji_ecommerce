import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('DATABASE_URL not found');
    process.exit(1);
}

const PujaSchema = new mongoose.Schema({
    id: String,
    name: String,
    category: String,
});

const Puja = mongoose.models.Puja || mongoose.model('Puja', PujaSchema);

async function run() {
    try {
        await mongoose.connect(DATABASE_URL);
        console.log('Connected to DB');
        
        const pujas = await Puja.find({});
        console.log('Total Pujas:', pujas.length);
        
        pujas.forEach((p, i) => {
            console.log(`${i+1}. name: "${p.name}", _id: ${p._id}, custom_id: ${p.id}`);
        });
        
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
