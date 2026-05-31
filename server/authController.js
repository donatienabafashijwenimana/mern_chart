import users from '../model/usermodel.js'; // Use consistent naming
import bcrypt from 'bcrypt'; // For password comparison
import { generatetoken } from '../LIB/utlis.js'; // Use your centralized utility

export const login = async (req, res) => {
    // Destructure email and password from the request body
    const { email, password, username } = req.body || {};
    const identifier = String(email || username || '').trim().toLowerCase();

    // Basic validation for presence of email and password
    if (!identifier || !password) {
        return res.status(400).json({ message: 'Email/Username and password are required.' });
    }

    try {
        // Search by either email or fullname
        const user = await users.findOne({
            $or: [{ email: identifier }, { fullname: identifier }],
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Security check: ensure user has a password in DB
        if (!user.password) {
            console.error('Password hash missing for user:', user.email);
            return res.status(500).json({ message: 'Internal server error' });
        }

        // Compare the provided plain-text password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(String(password), user.password);

        // If the passwords do not match
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Use centralized token generator (handles cookies and CORS)
        const token = generatetoken(user._id, res);

        // Send a success response with the token and relevant user information
        res.status(200).json({
            user_data: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                profilepic: user.profilepic // Include other fields as needed
            },
            message: 'Login successful',
            token
        });

    } catch (error) {
        // Detailed logging for Render console
        console.error('Login controller error stack:', error.stack || error);
        res.status(500).json({ message: 'Internal server error' });
    }
};