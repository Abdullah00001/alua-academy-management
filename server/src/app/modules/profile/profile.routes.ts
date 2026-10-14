import { Router } from 'express';
import {
  parentProfileSetupController,
  teacherProfileSetupController,
  getParentProfileController,
  updateParentProfileController,
  getTeacherProfileController,
  updateTeacherProfileController,
} from '@/app/modules/profile/profile.controllers';
import {
  checkAccountStatus,
  checkDeviceSessionMiddleware,
  checkUserAccessTokenMiddleware,
  checkUserExistenceMiddleware,
  requireRole,
} from '@/app/modules/auth/auth.middlewares';
import { validateReqBody } from '@/app/utils/system.utils';
import {
  setUpParentProfileSchema,
  setUpTeacherProfileSchema,
  updateParentProfileSchema,
  updateTeacherProfileSchema,
} from '@/app/modules/profile/profile.schema';
import { Role } from '@prisma/client';

const router = Router();

router
  .route('/profile/setup/parent')
  .post(
    checkUserAccessTokenMiddleware,
    checkUserExistenceMiddleware,
    checkAccountStatus,
    checkDeviceSessionMiddleware,
    requireRole(Role.PARENT),
    validateReqBody(setUpParentProfileSchema),
    parentProfileSetupController
  );

router
  .route('/profile/setup/teacher')
  .post(
    checkUserAccessTokenMiddleware,
    checkUserExistenceMiddleware,
    checkAccountStatus,
    checkDeviceSessionMiddleware,
    requireRole(Role.TEACHER),
    validateReqBody(setUpTeacherProfileSchema),
    teacherProfileSetupController
  );

router
  .route('/profile/parent')
  .get(
    checkUserAccessTokenMiddleware,
    checkUserExistenceMiddleware,
    checkAccountStatus,
    checkDeviceSessionMiddleware,
    requireRole(Role.PARENT),
    getParentProfileController
  );

router
  .route('/profile/parent')
  .post(
    checkUserAccessTokenMiddleware,
    checkUserExistenceMiddleware,
    checkAccountStatus,
    checkDeviceSessionMiddleware,
    requireRole(Role.PARENT),
    validateReqBody(updateParentProfileSchema),
    updateParentProfileController
  );

router
  .route('/profile/teacher')
  .get(
    checkUserAccessTokenMiddleware,
    checkUserExistenceMiddleware,
    checkAccountStatus,
    checkDeviceSessionMiddleware,
    requireRole(Role.TEACHER),
    getTeacherProfileController
  );

router
  .route('/profile/teacher')
  .post(
    checkUserAccessTokenMiddleware,
    checkUserExistenceMiddleware,
    checkAccountStatus,
    checkDeviceSessionMiddleware,
    requireRole(Role.TEACHER),
    validateReqBody(updateTeacherProfileSchema),
    updateTeacherProfileController
  );

export default router;
