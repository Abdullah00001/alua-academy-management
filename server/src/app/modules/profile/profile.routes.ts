import { Router } from 'express';
import { parentProfileSetupController } from '@/app/modules/profile/profile.controllers';
import {
  checkAccountStatus,
  checkDeviceSessionMiddleware,
  checkUserAccessTokenMiddleware,
  checkUserExistenceMiddleware,
} from '@/app/modules/auth/auth.middlewares';
import { validateReqBody } from '@/app/utils/system.utils';
import { setUpParentProfileSchema } from '@/app/modules/profile/profile.schema';

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

export default router;
