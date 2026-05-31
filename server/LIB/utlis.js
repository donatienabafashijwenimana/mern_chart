import jwt from 'jsonwebtoken'

export const generatetoken = (userid, res) => {
    const secret = process.env.secret_key || process.env.SECRET_KEY;
    
    if (!secret) {
        console.error("JWT Secret key is missing! Check your environment variables.");
        throw new Error("Internal Configuration Error");
    }

    const token = jwt.sign({ userid: userid.toString() }, secret, {
        expiresIn: "1d",
    });

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // Corrected to 7 days in milliseconds
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax', // 'none' is required for cross-site cookies
        secure: isProduction // must be true if sameSite is 'none'
    })
    return token
}