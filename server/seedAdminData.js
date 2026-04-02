import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

const seedAdminData = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error("No MONGODB_URI provided in .env");
            process.exit(1);
        }
        await mongoose.connect(mongoUri);
        const email = 'connect2rachit882@gmail.com';
        const existing = await Admin.findOne({ email });
        
        if (!existing) {
          await Admin.create({ email, password: 'Rachit@12' });
          console.log("Admin generated successfully in the distinct Admin collection! Check your database now.");
        } else {
          existing.password = 'Rachit@12';
          await existing.save();
          console.log("Admin password updated in the distinct Admin collection! Check your database now.");
        }
    } catch(err) {
        console.error(err);
    } finally {
        process.exit();
    }
};

seedAdminData();
