import { Job } from 'bullmq';
import { IJobHandler } from '@/app/@types/queue.types';
import { ISendRecoverUserOtp } from '@/app/queues/email/email.types';
import { QUEUE_JOBS } from '@/const';
import logger from '@/app/configs/logger.configs';
import { compile } from 'handlebars';
import { companyInformation } from '@/const';
import { mailOption } from '@/app/utils/system.utils';
import mailTransporter from '@/app/configs/nodemailer.config';
import recoverUserOtpTemplate from '@/app/templates/recoverUserOtpEmail.template';

const handler: IJobHandler<ISendRecoverUserOtp> = {
  name: QUEUE_JOBS.SEND_RECOVER_USER_OTP,
  handler: async (data: ISendRecoverUserOtp, job: Job) => {
    const { name, email, otp, otpExpireAt, traceId } = data;
    try {
      const template = compile(recoverUserOtpTemplate);
      const personalizedTemplate = template({ name, email, otp, otpExpireAt });
      const mail = mailOption({
        to: email,
        subject: `${companyInformation.name} : Password Reset Code : ${otp}`,
        html: personalizedTemplate,
        replyTo: companyInformation.email,
      });
      await mailTransporter.sendMail(mail);
    } catch (error) {
      logger.error('Failed to send recover user otp email:', {
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
