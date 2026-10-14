import { Router } from 'express';
import {
  changePasswordController,
  getSettingsController,
  updateLanguageController,
  updateNotificationController,
} from '@/app/modules/settings/settings.controllers';
import {
  checkUserAccessTokenMiddleware,
  checkUserExistenceMiddleware,
  checkAccountStatus,
  checkDeviceSessionMiddleware,
} from '@/app/modules/auth/auth.middlewares';
import { validateReqBody } from '@/app/utils/system.utils';
import {
  changePasswordSchema,
  updateLanguageSchema,
  updateNotificationSchema,
} from '@/app/modules/settings/settings.schema';
import { checkCurrentPassword } from '@/app/modules/settings/settings.middlewares';

const router = Router();

router
  .route('/settings')
  .get(
    checkUserAccessTokenMiddleware,
    checkUserExistenceMiddleware,
    checkAccountStatus,
    checkDeviceSessionMiddleware,
    getSettingsController
  );

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

router
  .route('/settings/language')
  .post(
    checkUserAccessTokenMiddleware,
    checkUserExistenceMiddleware,
    checkAccountStatus,
    checkDeviceSessionMiddleware,
    validateReqBody(updateLanguageSchema),
    updateLanguageController
  );

router
  .route('/settings/notification')
  .post(
    checkUserAccessTokenMiddleware,
    checkUserExistenceMiddleware,
    checkAccountStatus,
    checkDeviceSessionMiddleware,
    validateReqBody(updateNotificationSchema),
    updateNotificationController
  );

export default router;
