import { Job } from 'bullmq';
import { IJobHandler } from '@/app/@types/queue.types';
import { IResetRecoverUserPasswordSuccessful } from '@/app/queues/email/email.types';
import { companyInformation, QUEUE_JOBS } from '@/const';
import logger from '@/app/configs/logger.configs';
import { compile } from 'handlebars';
import resetRecoverUserPasswordSuccessTemplate from '@/app/templates/resetRecoverUserPasswordSuccess.template';
import { mailOption } from '@/app/utils/system.utils';
import mailTransporter from '@/app/configs/nodemailer.config';

const handler: IJobHandler<IResetRecoverUserPasswordSuccessful> = {
  name: QUEUE_JOBS.RESET_RECOVER_USER_PASSWORD_SUCCESSFUL,
  handler: async (data: IResetRecoverUserPasswordSuccessful, job: Job) => {
    const { email, name, traceId } = data;
    try {
      const template = compile(resetRecoverUserPasswordSuccessTemplate);
      const personalizedTemplate = template({ name, email });
      const mail = mailOption({
        to: email,
        subject: `Your ${companyInformation.name} password has been reset successfully`,
        html: personalizedTemplate,
        replyTo: companyInformation.email,
      });
      await mailTransporter.sendMail(mail);
    } catch (error) {
      logger.error(
        'Failed to send reset recover user password success email:',
        {
          data,
          jobId: job.id,
          error,
          traceId,
        }
      );
      throw error;
    }
  },
};

export default handler;
