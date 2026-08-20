import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto/admin.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [jobs, applications, enquiries] = await Promise.all([
      this.prisma.job.count(),
      this.prisma.application.count(),
      this.prisma.enquiry.count(),
    ]);
    return { jobs, applications, enquiries };
  }

  async getProfile(adminId: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });
    if (!admin) throw new NotFoundException('Admin not found');
    const { passwordHash, ...safeAdmin } = admin;
    void passwordHash;
    return safeAdmin;
  }

  async updateProfile(adminId: string, dto: UpdateProfileDto) {
    const admin = await this.prisma.admin.update({
      where: { id: adminId },
      data: dto,
    });
    const { passwordHash, ...safeAdmin2 } = admin;
    void passwordHash;
    return safeAdmin2;
  }

  async changePassword(adminId: string, dto: ChangePasswordDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });
    if (!admin) throw new NotFoundException('Admin not found');

    const isValid = await argon2.verify(admin.passwordHash, dto.oldPassword);
    if (!isValid) throw new BadRequestException('Invalid old password');

    const newHash = await argon2.hash(dto.newPassword);
    await this.prisma.admin.update({
      where: { id: adminId },
      data: { passwordHash: newHash },
    });
    return { message: 'Password updated successfully' };
  }
}
