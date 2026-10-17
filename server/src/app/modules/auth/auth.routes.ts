import { Router } from 'express';
import {
  signupController,
  verifySignupUserController,
  resendVerifySignupOtpController,
  checkUserAccessTokenController,
  loginController,
  logoutController,
  adminLoginController,
  checkAdminAccessTokenController,
  refreshAdminAccessTokenController,
} from '@/app/modules/auth/auth.controllers';
import {
  checkIsSignupUserExist,
  checkOtpMiddleware,
  checkOtpPageTokenMiddleware,
  checkUserExistenceMiddleware,
  checkAccountStatus,
  checkDeviceSessionMiddleware,
  checkUserAccessTokenMiddleware,
  checkPassword,
  findUserForLoginByEmail,
} from '@/app/modules/auth/auth.middlewares';
import { validateReqBody } from '@/app/utils/system.utils';
import {
  checkAccessTokenSchema,
  loginSchema,
  signupSchema,
  verifySignupSchema,
} from '@/app/modules/auth/auth.schema';

const router = Router();

router
  .route('/auth/signup')
  .post(
    validateReqBody(signupSchema),
    checkIsSignupUserExist,
    signupController
  );

router
  .route('/auth/verify')
  .post(
    checkOtpPageTokenMiddleware,
    checkUserExistenceMiddleware,
    validateReqBody(verifySignupSchema),
    checkOtpMiddleware,
    verifySignupUserController
  );

router
  .route('/auth/resend')
  .post(
    checkOtpPageTokenMiddleware,
    checkUserExistenceMiddleware,
    resendVerifySignupOtpController
  );

router
  .route('/auth/check')
  .post(
    validateReqBody(checkAccessTokenSchema),
    checkUserAccessTokenMiddleware,
    checkUserExistenceMiddleware,
    checkAccountStatus,
    checkDeviceSessionMiddleware,
    checkUserAccessTokenController
  );

router
  .route('/auth/login')
  .post(
    validateReqBody(loginSchema),
    findUserForLoginByEmail,
    checkPassword,
    checkAccountStatus,
    loginController
  );

router
  .route('/auth/logout')
  .post(
    checkUserAccessTokenMiddleware,
    checkUserExistenceMiddleware,
    checkAccountStatus,
    checkDeviceSessionMiddleware,
    logoutController
  );

router.route('/admin/auth/login').post(adminLoginController);

router.route('/admin/auth/check').post(checkAdminAccessTokenController);

router.route('/admin/auth/refresh').post(refreshAdminAccessTokenController);

export default router;
