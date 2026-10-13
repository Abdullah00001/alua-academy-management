import { Router } from 'express';
import {
  signupController,
  verifySignupUserController,
} from '@/app/modules/auth/auth.controllers';
import {
  checkIsSignupUserExist,
  checkOtpMiddleware,
  checkOtpPageTokenMiddleware,
  checkUserExistenceMiddleware,
} from '@/app/modules/auth/auth.middlewares';
import { validateReqBody } from '@/app/utils/system.utils';
import {
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

export default router;
