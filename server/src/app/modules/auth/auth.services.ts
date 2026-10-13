import { TSignupPayload } from '@/app/modules/auth/auth.types';

export const signupService = async ({
  payload,
}: {
  payload: TSignupPayload;
}): Promise<void> => {
  try {
    console.log('signupService called', payload);
    return;
  } catch (error) {
    throw error;
  }
};
