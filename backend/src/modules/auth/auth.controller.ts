import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { authService } from '../../services/auth.service';

export class AuthController {
  // Doctor login
  async doctorLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: 'Email and password are required',
        });
        return;
      }

      // Find doctor by email
      const doctor = await prisma.doctor.findUnique({
        where: { email },
      });

      if (!doctor || !doctor.password) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
        return;
      }

      // Verify password
      const isValidPassword = await authService.comparePassword(password, doctor.password);

      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
        return;
      }

      // Generate token
      const token = authService.generateToken({
        userId: doctor.id,
        email: doctor.email!,
        role: 'DOCTOR',
        name: doctor.name,
      });

      res.json({
        success: true,
        token,
        user: {
          id: doctor.id,
          name: doctor.name,
          email: doctor.email,
          role: 'DOCTOR',
        },
      });
    } catch (error) {
      console.error('Doctor login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed',
      });
    }
  }

  // Staff login
  async staffLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: 'Email and password are required',
        });
        return;
      }

      // Find staff by email
      const staff = await prisma.staff.findUnique({
        where: { email },
      });

      if (!staff) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
        return;
      }

      // Verify password
      const isValidPassword = await authService.comparePassword(password, staff.password);

      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
        return;
      }

      // Generate token
      const token = authService.generateToken({
        userId: staff.id,
        email: staff.email,
        role: staff.role as 'STAFF' | 'ADMIN',
        name: staff.name,
      });

      res.json({
        success: true,
        token,
        user: {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: staff.role,
        },
      });
    } catch (error) {
      console.error('Staff login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed',
      });
    }
  }

  // Set doctor password (for initial setup)
  async setDoctorPassword(req: Request, res: Response) {
    try {
      const { doctorId, password } = req.body;

      if (!doctorId || !password) {
        res.status(400).json({
          success: false,
          error: 'Doctor ID and password are required',
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters',
        });
        return;
      }

      const hashedPassword = await authService.hashPassword(password);

      const doctor = await prisma.doctor.update({
        where: { id: doctorId },
        data: { password: hashedPassword },
      });

      res.json({
        success: true,
        message: 'Password set successfully',
        doctorId: doctor.id,
      });
    } catch (error) {
      console.error('Set doctor password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to set password',
      });
    }
  }

  // Create staff account
  async createStaff(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({
          success: false,
          error: 'Name, email, and password are required',
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters',
        });
        return;
      }

      // Check if email already exists
      const existingStaff = await prisma.staff.findUnique({
        where: { email },
      });

      if (existingStaff) {
        res.status(400).json({
          success: false,
          error: 'Email already in use',
        });
        return;
      }

      const hashedPassword = await authService.hashPassword(password);

      const staff = await prisma.staff.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || 'STAFF',
        },
      });

      res.status(201).json({
        success: true,
        staff: {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: staff.role,
        },
      });
    } catch (error) {
      console.error('Create staff error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create staff account',
      });
    }
  }

  // Get current user info
  async getCurrentUser(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      res.json({
        success: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user info',
      });
    }
  }
}

export const authController = new AuthController();
