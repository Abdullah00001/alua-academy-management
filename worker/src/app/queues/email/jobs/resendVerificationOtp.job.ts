import { Job } from 'bullmq';
import { IJobHandler } from '@/app/@types/queue.types';
import { IResendVerificationOtp } from '@/app/queues/email/email.types';
import { companyInformation, QUEUE_JOBS } from '@/const';
import logger from '@/app/configs/logger.configs';
import { compile } from 'handlebars';
import { mailOption } from '@/app/utils/system.utils';
import mailTransporter from '@/app/configs/nodemailer.config';
import resendVerificationOtpTemplate from '@/app/templates/resendVerificationOtp.template';

const handler: IJobHandler<IResendVerificationOtp> = {
  name: QUEUE_JOBS.RESEND_VERIFICATION_OTP,
  handler: async (data: IResendVerificationOtp, job: Job) => {
    const { email, name, otp, otpExpireAt, traceId } = data;
    try {
      const template = compile(resendVerificationOtpTemplate);
      const personalizedTemplate = template({ name, email, otp, otpExpireAt });
      const mail = mailOption({
        to: email,
        subject: `Resend verification otp`,
        html: personalizedTemplate,
        replyTo: companyInformation.email,
      });
      await mailTransporter.sendMail(mail);
    } catch (error) {
      logger.error('Failed to send verification otp email:', {
        data,
        jobId: job.id,
        error,
        traceId,
      });
      throw error;
    }
  },
};

export default handler;
