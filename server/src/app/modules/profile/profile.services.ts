import { User } from '@prisma/client';
import {
  TSetupParentProfilePayload,
  TSetupTeacherProfilePayload,
} from '@/app/modules/profile/profile.types';
import prisma from '@/app/configs/db.configs';
import {
  ParentProfileSetupDTO,
  TeacherProfileSetupDTO,
} from '@/app/modules/profile/profile.dto';

/**
 * This service function will handle the parent profile setup request.
 *
 * @param param0 - {Object} - {payload: TSetupParentProfilePayload, user: User}
 * @returns {Promise<ParentProfileSetupDTO>}
 */
export const parentProfileSetupService = async ({
  payload,
  user,
}: {
  payload: TSetupParentProfilePayload;
  user: User;
}): Promise<ParentProfileSetupDTO> => {
  try {
    const { address, avatarUrl, occupation, relationWithChild } = payload;
    const data = await prisma.$transaction(async (tx) => {
      const data = await tx.user.update({
        where: { id: user.id },
        data: {
          avatarUrl,
          isProfileSetup: true,
          profileCompletedAt: new Date(),
        },
      });
      await tx.parent.create({
        data: {
          userId: user.id,
          address,
          occupation,
          relationWithChild,
        },
      });
      return data;
    });
    return new ParentProfileSetupDTO(
      data.id,
      data.fullName,
      data.avatarUrl,
      data.role,
      data.status,
      data.isProfileSetup,
      data.profileCompletedAt
    );
  } catch (error) {
    throw error;
  }
};

/**
 * This service function will handle the teacher profile setup request.
 *
 * @param param0 - {Object} - {payload: TSetupTeacherProfilePayload, user: User}
 * @returns {Promise<TeacherProfileSetupDTO>}
 */
export const teacherProfileSetupService = async ({
  payload,
  user,
}: {
  payload: TSetupTeacherProfilePayload;
  user: User;
}): Promise<TeacherProfileSetupDTO> => {
  try {
    const { bio, department, designation, avatarUrl } = payload;
    const data = await prisma.$transaction(async (tx) => {
      const data = await tx.user.update({
        where: { id: user.id },
        data: {
          avatarUrl,
          isProfileSetup: true,
          profileCompletedAt: new Date(),
        },
      });
      await tx.teacher.create({
        data: {
          userId: user.id,
          department,
          designation,
          bio,
        },
      });
      return data;
    });
    return new TeacherProfileSetupDTO(
      data.id,
      data.fullName,
      data.avatarUrl,
      data.role,
      data.status,
      data.isProfileSetup,
      data.profileCompletedAt
    );
  } catch (error) {
    throw error;
  }
};
