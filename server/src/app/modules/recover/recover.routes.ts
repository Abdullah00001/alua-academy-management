import { Router } from 'express';
import {
  findRecoverUserController,
  resendRecoverUserOtpController,
  verifyRecoverUserOtpController,
} from '@/app/modules/recover/recover.controllers';
import { validateReqBody } from '@/app/utils/system.utils';
import {
  findRecoverUserByEmailSchema,
  verifyRecoverUserOtpSchema,
} from '@/app/modules/recover/recover.schema';
import {
  findRecoverUserMiddleware,
  checkResetPasswordPageTokenMiddleware,
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

export default router;
