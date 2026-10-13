import { Router } from 'express';
import { signupController } from '@/app/modules/auth/auth.controllers';
import { checkIsSignupUserExist } from '@/app/modules/auth/auth.middlewares';
import { validateReqBody } from '@/app/utils/system.utils';
import { signupSchema } from '@/app/modules/auth/auth.schema';

const router = Router();

router
  .route('/auth/signup')
  .post(
    validateReqBody(signupSchema),
    checkIsSignupUserExist,
    signupController
  );

export default router;
