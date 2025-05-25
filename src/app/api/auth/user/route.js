import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req) {
  try {
    // Extract token from cookie (Next.js 13+ recommended way)
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));
    const token = cookies.token;

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized: No token' }), { status: 401 });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }

    // Assuming your token payload has user's email (adjust if different)
    const userEmail = decoded.email || (decoded.user && decoded.user.email);

    if (!userEmail) {
      return new Response(JSON.stringify({ error: 'User email not found in token' }), { status: 401 });
    }

    // Fetch user from DB by email
    const user = await User.findOne({ where: { email: userEmail } });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Return user data (serialize properly if needed)
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
