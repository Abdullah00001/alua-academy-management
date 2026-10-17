import { Router } from 'express';
import { findRecoverUserController, resendRecoverUserOtpController } from '@/app/modules/recover/recover.controllers';
import { validateReqBody } from '@/app/utils/system.utils';
import { findRecoverUserByEmailSchema } from '@/app/modules/recover/recover.schema';
import { findRecoverUserMiddleware } from '@/app/modules/recover/recover.middlewares';

const router = Router();

router
  .route('/recover/find')
  .post(
    validateReqBody(findRecoverUserByEmailSchema),
    findRecoverUserMiddleware,
    findRecoverUserController
  );

router.route('/recover/resend').post(resendRecoverUserOtpController);

export default router;
