import authService from '../services/auth.service.js';

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validación de entrada
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email and password are required',
        });
      }

      // Validación básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Invalid email format',
        });
      }

      // Llamar al servicio de autenticación
      const result = await authService.login(email, password);

      res.status(200).json({
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      console.error('Login error:', error.message);

      // Manejo específico de errores
      if (error.message.includes('Invalid credentials')) {
        return res.status(401).json({
          error: 'Invalid email or password',
        });
      }

      res.status(500).json({
        error: 'Login failed',
        message: error.message,
      });
    }
  }

  async signup(req, res) {
    try {
      const { email, password, confirmPassword, fullName } = req.body;

      // Validación de entrada
      if (!email || !password || !confirmPassword) {
        return res.status(400).json({
          error: 'Email, password, and password confirmation are required',
        });
      }

      // Validación de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Invalid email format',
        });
      }

      // Validación de longitud de contraseña
      if (password.length < 6) {
        return res.status(400).json({
          error: 'Password must be at least 6 characters long',
        });
      }

      // Validación de contraseñas coincidentes
      if (password !== confirmPassword) {
        return res.status(400).json({
          error: 'Passwords do not match',
        });
      }

      // Preparar metadata del usuario
      const metadata = {};
      if (fullName) {
        metadata.full_name = fullName;
      }

      // Llamar al servicio de autenticación
      const result = await authService.signup(email, password, metadata);

      res.status(201).json({
        message: result.message,
        data: result.user,
      });
    } catch (error) {
      console.error('Signup error:', error.message);

      // Manejo específico de errores
      if (error.message.includes('already registered')) {
        return res.status(409).json({
          error: 'Email already registered',
        });
      }

      if (error.message.includes('Signup failed')) {
        return res.status(400).json({
          error: 'Signup failed',
          message: error.message,
        });
      }

      res.status(500).json({
        error: 'Signup failed',
        message: error.message,
      });
    }
  }

  async logout(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          error: 'User not authenticated',
        });
      }

      const result = await authService.logout(userId);

      res.status(200).json({
        message: 'Logout successful',
        data: result,
      });
    } catch (error) {
      console.error('Logout error:', error.message);
      res.status(500).json({
        error: 'Logout failed',
        message: error.message,
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          error: 'Refresh token is required',
        });
      }

      const result = await authService.refreshToken(refreshToken);

      res.status(200).json({
        message: 'Token refreshed',
        data: result,
      });
    } catch (error) {
      console.error('Refresh token error:', error.message);

      if (error.message.includes('Token refresh failed')) {
        return res.status(401).json({
          error: 'Invalid or expired refresh token',
        });
      }

      res.status(500).json({
        error: 'Token refresh failed',
        message: error.message,
      });
    }
  }

  async getCurrentUser(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          error: 'User not authenticated',
        });
      }

      const user = await authService.getUserById(userId);

      res.status(200).json({
        message: 'User retrieved',
        data: user,
      });
    } catch (error) {
      console.error('Get user error:', error.message);
      res.status(500).json({
        error: 'Failed to get user',
        message: error.message,
      });
    }
  }
}

export default new AuthController();
