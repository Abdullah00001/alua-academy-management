import { Router } from 'express';
import {
  parentProfileSetupController,
  teacherProfileSetupController,
} from '@/app/modules/profile/profile.controllers';
import {
  checkAccountStatus,
  checkDeviceSessionMiddleware,
  checkUserAccessTokenMiddleware,
  checkUserExistenceMiddleware,
} from '@/app/modules/auth/auth.middlewares';
import { validateReqBody } from '@/app/utils/system.utils';
import {
  setUpParentProfileSchema,
  setUpTeacherProfileSchema,
} from '@/app/modules/profile/profile.schema';

const router = Router();

router
  .route('/profile/setup/parent')
  .post(
    checkUserAccessTokenMiddleware,
    checkUserExistenceMiddleware,
    checkAccountStatus,
    checkDeviceSessionMiddleware,
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
    validateReqBody(setUpTeacherProfileSchema),
    teacherProfileSetupController
  );

export default router;
