-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "fuzzystrmatch";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis_tiger_geocoder";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis_topology";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PARENT', 'TEACHER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "CohortStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('SUBMITTED', 'REVIEWED');

-- CreateEnum
CREATE TYPE "AttitudeRating" AS ENUM ('NEEDS_ATTENTION', 'SATISFACTORY', 'EXCELLENT');

-- CreateEnum
CREATE TYPE "WorkEffortRating" AS ENUM ('MODERATE', 'ON_TRACK', 'HIGH_EFFORT');

-- CreateEnum
CREATE TYPE "HomeworkStatus" AS ENUM ('PENDING', 'COMPLETED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('PARENT_ADMIN', 'TEACHER_ADMIN');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'ES');

-- CreateEnum
CREATE TYPE "AnnouncementAudience" AS ENUM ('PARENTS', 'TEACHERS');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('FEE_CREATED', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'REPORT_SUBMITTED', 'REPORT_REVIEWED', 'HOMEWORK_ASSIGNED', 'SESSION_REMINDER', 'SESSION_STARTED', 'CHILD_ABSENT', 'NEW_MESSAGE', 'ANNOUNCEMENT');
