import jwt from 'jsonwebtoken';
import supabase from '../lib/supabase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '1h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

class AuthService {
  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(`Supabase auth error: ${error.message}`);
      }

      if (!data.user) {
        throw new Error('Invalid credentials');
      }

      const { user, session } = data;
      const token = this.generateToken(user.id, user.email);
      const refreshToken = this.generateRefreshToken(user.id, user.email);

      return {
        token,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
        },
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async signup(email, password, metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        throw new Error(`Supabase auth error: ${error.message}`);
      }

      if (!data.user) {
        throw new Error('User creation failed');
      }

      const { user } = data;

      return {
        user: {
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
        },
        message: 'Signup successful. Please check your email to verify your account.',
      };
    } catch (error) {
      throw new Error(`Signup failed: ${error.message}`);
    }
  }

  async logout(userId) {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(`Logout error: ${error.message}`);
      }
      return { success: true };
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET);
      const token = this.generateToken(decoded.userId, decoded.email);

      return {
        token,
        refreshToken,
        user: {
          id: decoded.userId,
          email: decoded.email,
        },
      };
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  async getUserById(userId) {
    try {
      const { data, error } = await supabase.auth.admin.getUserById(userId);

      if (error) {
        throw new Error(`Failed to get user: ${error.message}`);
      }

      return {
        id: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata,
      };
    } catch (error) {
      throw new Error(`Get user failed: ${error.message}`);
    }
  }

  generateToken(userId, email) {
    return jwt.sign(
      {
        userId,
        email,
        type: 'access',
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  generateRefreshToken(userId, email) {
    return jwt.sign(
      {
        userId,
        email,
        type: 'refresh',
      },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error(`Invalid token: ${error.message}`);
    }
  }
}

export default new AuthService();
