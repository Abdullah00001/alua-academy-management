import { Router } from 'express';
import AuthRoutes from '@/app/modules/auth/auth.routes';
import profileRoutes from '@/app/modules/profile/profile.routes';

const routes: Router[] = [profileRoutes, AuthRoutes];

const v1Routes = Router();

routes.forEach((route) => v1Routes.use(route));

export default v1Routes;
