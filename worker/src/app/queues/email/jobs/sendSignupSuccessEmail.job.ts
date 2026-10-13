import { Job } from 'bullmq';
import { IJobHandler } from '@/app/@types/queue.types';
import { ISendSignupSuccessEmail } from '@/app/queues/email/email.types';
import { companyInformation, QUEUE_JOBS } from '@/const';
import logger from '@/app/configs/logger.configs';
import { Role } from '@prisma/client';
import signupSuccessForParentTemplate from '@/app/templates/signupSuccessForParent.template';
import signupSuccessForTeacherTemplate from '@/app/templates/signupSuccessForTeacher.template';
import { compile } from 'handlebars';
import { mailOption } from '@/app/utils/system.utils';
import mailTransporter from '@/app/configs/nodemailer.config';

const handler: IJobHandler<ISendSignupSuccessEmail> = {
  name: QUEUE_JOBS.SEND_SIGNUP_SUCCESS_EMAIL,
  handler: async (data: ISendSignupSuccessEmail, job: Job) => {
    const { email, name, role, traceId } = data;
    try {
      const signupSuccessEmailTemplate =
        role === Role.PARENT
          ? signupSuccessForParentTemplate
          : signupSuccessForTeacherTemplate;
      const template = compile(signupSuccessEmailTemplate);
      const personalizedTemplate = template({ name, email });
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
