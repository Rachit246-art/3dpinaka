import express from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

const router = express.Router();

// GET /api/admin - Return admin details
router.get('/', async (req, res) => {
    try {
        const admin = await Admin.findOne(); // Assuming single super admin for simplicity
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        
        // Exclude password from response
        const { password, ...adminData } = admin.toObject();
        res.status(200).json(adminData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin data', error: error.message });
    }
});

// PUT /api/admin - Update admin name and phone
router.put('/', async (req, res) => {
    try {
        const { name, phone } = req.body;
        const admin = await Admin.findOne();
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        if (name) admin.name = name;
        if (phone) admin.phone = phone;

        const updatedAdmin = await admin.save();
        const { password, ...adminData } = updatedAdmin.toObject();
        
        res.status(200).json(adminData);
    } catch (error) {
        res.status(500).json({ message: 'Error updating admin details', error: error.message });
    }
});

// PUT /api/admin/password - Update password securely
router.put('/password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const admin = await Admin.findOne();
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid current password' });

        admin.password = newPassword; // Pre-save hook handles hashing
        await admin.save();
        
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password', error: error.message });
    }
});

export default router;
