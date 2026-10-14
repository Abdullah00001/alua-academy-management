import { z } from 'zod';
import { User } from '@prisma/client';
import {
  setUpParentProfileSchema,
  setUpTeacherProfileSchema,
  updateParentProfileSchema,
  updateTeacherProfileSchema,
} from '@/app/modules/profile/profile.schema';

export type TSetupParentProfilePayload = z.infer<
  typeof setUpParentProfileSchema
>;

export type TSetupTeacherProfilePayload = z.infer<
  typeof setUpTeacherProfileSchema
>;

export type TUpdateParentProfilePayload = z.infer<
  typeof updateParentProfileSchema
>;

export type TUpdateTeacherProfilePayload = z.infer<
  typeof updateTeacherProfileSchema
>;

export interface ISetupParentProfileParams {
  user: User;
  payload: TSetupParentProfilePayload;
}

export interface ISetupTeacherProfileParams {
  user: User;
  payload: TSetupTeacherProfilePayload;
}

export interface IGetParentProfileParams {
  user: User;
}

export interface IUpdateParentProfileParams {
  user: User;
  payload: TUpdateParentProfilePayload;
}

export interface IGetTeacherProfileParams {
  user: User;
}

export interface IUpdateTeacherProfileParams {
  user: User;
  payload: TUpdateTeacherProfilePayload;
}
