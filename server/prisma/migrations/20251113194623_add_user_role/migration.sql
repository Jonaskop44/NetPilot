-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMINISTRATOR', 'TEACHER', 'STUDENT');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'STUDENT';
