// Types specific to the email queue can be defined here
// export interface IEmailJobData { ... }

export interface IAccountCreateSuccess {
  // Add properties here
  otp: string;
  otpExpireAt: number;
  name: string;
  email: string;
  traceId: string;
}
