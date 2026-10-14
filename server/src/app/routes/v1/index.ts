import { Router } from 'express';
import AuthRoutes from '@/app/modules/auth/auth.routes';
import profileRoutes from '@/app/modules/profile/profile.routes';
import MediaRoutes from '@/app/modules/media/media.routes';

const routes: Router[] = [profileRoutes, AuthRoutes, MediaRoutes];

const v1Routes = Router();

routes.forEach((route) => v1Routes.use(route));

export default v1Routes;
