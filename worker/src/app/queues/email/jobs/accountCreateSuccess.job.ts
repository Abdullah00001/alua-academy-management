import { Job } from 'bullmq';
import { IJobHandler } from '@/app/@types/queue.types';
import { IAccountCreateSuccess } from '@/app/queues/email/email.types';
import { companyInformation, QUEUE_JOBS } from '@/const';
import logger from '@/app/configs/logger.configs';
import { mailOption } from '@/app/utils/system.utils';
import { compile } from 'handlebars';
import mailTransporter from '@/app/configs/nodemailer.config';
import signupEmailTemplate from '@/app/templates/signupEmail.template';

const handler: IJobHandler<IAccountCreateSuccess> = {
  name: QUEUE_JOBS.ACCOUNT_CREATE_SUCCESS,
  handler: async (data: IAccountCreateSuccess, job: Job) => {
    const { email, name, otp, otpExpireAt, traceId } = data;
    try {
      const template = compile(signupEmailTemplate);
      const personalizedTemplate = template({ name, email, otp, otpExpireAt });
      const mail = mailOption({
        to: email,
        subject: `Welcome to ${companyInformation.name}. Please verify your email.`,
        html: personalizedTemplate,
        replyTo: companyInformation.email,
      });
      await mailTransporter.sendMail(mail);
    } catch (error) {
      logger.error('Failed to send signup success email:', {
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
