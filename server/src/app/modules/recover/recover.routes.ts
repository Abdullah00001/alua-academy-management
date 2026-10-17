import { Router } from 'express';
import {
  findRecoverUserController,
  resendRecoverUserOtpController,
} from '@/app/modules/recover/recover.controllers';
import { validateReqBody } from '@/app/utils/system.utils';
import { findRecoverUserByEmailSchema } from '@/app/modules/recover/recover.schema';
import {
  findRecoverUserMiddleware,
  checkResetPasswordPageTokenMiddleware,
} from '@/app/modules/recover/recover.middlewares';
import {
  checkAccountStatus,
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

export default router;
