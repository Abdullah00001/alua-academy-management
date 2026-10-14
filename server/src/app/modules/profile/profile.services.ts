import { Parent, Teacher, User, UserPreference } from '@prisma/client';
import {
  IGetParentProfileParams,
  IGetTeacherProfileParams,
  IUpdateParentProfileParams,
  IUpdateTeacherProfileParams,
  TSetupParentProfilePayload,
  TSetupTeacherProfilePayload,
} from '@/app/modules/profile/profile.types';
import prisma from '@/app/configs/db.configs';
import {
  ParentProfileDTO,
  ParentProfileSetupDTO,
  TeacherProfileDTO,
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
      await tx.parent.update({
        where: { userId: user.id },
        data: {
          address,
          occupation,
          relationWithChild,
        },
      });
      return data;
    });
    return ParentProfileSetupDTO.buildSession(data);
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
      await tx.teacher.update({
        where: { userId: user.id },
        data: {
          department,
          designation,
          bio,
        },
      });
      return data;
    });
    return TeacherProfileSetupDTO.buildSession(data);
  } catch (error) {
    throw error;
  }
};

/**
 * This service retrieves the parent profile for the authenticated user.
 */
export const getParentProfileService = async ({
  user,
}: IGetParentProfileParams): Promise<ParentProfileDTO | null> => {
  try {
    const userWithParent = await prisma.user.findUnique({
      where: { id: user.id },
      include: { parent: true, preferences: true },
    });

    if (!userWithParent || !userWithParent.parent) {
      return null;
    }

    return ParentProfileDTO.build(userWithParent as User & { parent: Parent; preferences?: UserPreference | null });
  } catch (error) {
    throw error;
  }
};

/**
 * This service updates the parent profile fields and user fields.
 */
export const updateParentProfileService = async ({
  user,
  payload,
}: IUpdateParentProfileParams): Promise<ParentProfileDTO | null> => {
  try {
    const { fullName, avatarUrl, phone, occupation, address, relationWithChild } =
      payload;

    const updatedUser = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          fullName,
          avatarUrl,
          phone,
        },
      });

      await tx.parent.update({
        where: { userId: user.id },
        data: {
          occupation,
          address,
          relationWithChild,
        },
      });

      return tx.user.findUnique({
        where: { id: user.id },
        include: { parent: true, preferences: true },
      });
    });

    if (!updatedUser || !updatedUser.parent) {
      return null;
    }

    return ParentProfileDTO.build(updatedUser as User & { parent: Parent; preferences?: UserPreference | null });
  } catch (error) {
    throw error;
  }
};

/**
 * This service retrieves the teacher profile for the authenticated user.
 */
export const getTeacherProfileService = async ({
  user,
}: IGetTeacherProfileParams): Promise<TeacherProfileDTO | null> => {
  try {
    const userWithTeacher = await prisma.user.findUnique({
      where: { id: user.id },
      include: { teacher: true, preferences: true },
    });

    if (!userWithTeacher || !userWithTeacher.teacher) {
      return null;
    }

    return TeacherProfileDTO.build(userWithTeacher as User & { teacher: Teacher; preferences?: UserPreference | null });
  } catch (error) {
    throw error;
  }
};

/**
 * This service updates the teacher profile fields and user fields.
 */
export const updateTeacherProfileService = async ({
  user,
  payload,
}: IUpdateTeacherProfileParams): Promise<TeacherProfileDTO | null> => {
  try {
    const { fullName, avatarUrl, phone, department, designation, bio } = payload;

    const updatedUser = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          fullName,
          avatarUrl,
          phone,
        },
      });

      await tx.teacher.update({
        where: { userId: user.id },
        data: {
          department,
          designation,
          bio,
        },
      });

      return tx.user.findUnique({
        where: { id: user.id },
        include: { teacher: true, preferences: true },
      });
    });

    if (!updatedUser || !updatedUser.teacher) {
      return null;
    }

    return TeacherProfileDTO.build(updatedUser as User & { teacher: Teacher; preferences?: UserPreference | null });
  } catch (error) {
    throw error;
  }
};
