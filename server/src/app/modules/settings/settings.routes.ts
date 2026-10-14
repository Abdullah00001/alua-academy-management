import { Router } from 'express';
import { changePasswordController } from '@/app/modules/settings/settings.controllers';
import {
  checkUserAccessTokenMiddleware,
  checkUserExistenceMiddleware,
  checkAccountStatus,
  checkDeviceSessionMiddleware,
} from '@/app/modules/auth/auth.middlewares';
import { validateReqBody } from '@/app/utils/system.utils';
import { changePasswordSchema } from '@/app/modules/settings/settings.schema';
import { checkCurrentPassword } from '@/app/modules/settings/settings.middlewares';

const router = Router();

router
  .route('/settings/password')
  .post(
    checkUserAccessTokenMiddleware,
    checkUserExistenceMiddleware,
    checkAccountStatus,
    checkDeviceSessionMiddleware,
    validateReqBody(changePasswordSchema),
    checkCurrentPassword,
    changePasswordController
  );

export default router;
