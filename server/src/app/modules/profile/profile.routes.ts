import { Router } from 'express';
import { parentProfileSetupController } from '@/app/modules/profile/profile.controllers';

const router = Router();

router.route('/profile/setup/parent').post(parentProfileSetupController);

export default router;
