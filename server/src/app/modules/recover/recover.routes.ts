import { Router } from 'express';
import {
  findRecoverUserController,
  resendRecoverUserOtpController,
  verifyRecoverUserOtpController,
  resetRecoverUserPasswordController,
} from '@/app/modules/recover/recover.controllers';
import { validateReqBody } from '@/app/utils/system.utils';
import {
  findRecoverUserByEmailSchema,
  resetRecoverUserPasswordSchema,
  verifyRecoverUserOtpSchema,
} from '@/app/modules/recover/recover.schema';
import {
  findRecoverUserMiddleware,
  checkResetPasswordPageTokenMiddleware,
  checkCurrentPasswordForReset,
} from '@/app/modules/recover/recover.middlewares';
import {
  checkAccountStatus,
  checkOtpMiddleware,
  checkUserExistenceMiddleware,
} from '@/app/modules/auth/auth.middlewares';

const router = Router();

router
  .route('/recover/find')
  .post(
    validateReqBody(findRecoverUserByEmailSchema),
    findRecoverUserMiddleware,
    checkAccountStatus,
    findRecoverUserController
  );

router
  .route('/recover/resend')
  .post(
    checkResetPasswordPageTokenMiddleware,
    checkUserExistenceMiddleware,
    checkAccountStatus,
    resendRecoverUserOtpController
  );

router
  .route('/recover/verify')
  .post(
    checkResetPasswordPageTokenMiddleware,
    checkUserExistenceMiddleware,
    checkAccountStatus,
    validateReqBody(verifyRecoverUserOtpSchema),
    checkOtpMiddleware,
    verifyRecoverUserOtpController
  );

router
  .route('/recover/reset')
  .post(
    checkResetPasswordPageTokenMiddleware,
    checkUserExistenceMiddleware,
    checkAccountStatus,
    validateReqBody(resetRecoverUserPasswordSchema),
    checkCurrentPasswordForReset,
    resetRecoverUserPasswordController
  );

export default router;
