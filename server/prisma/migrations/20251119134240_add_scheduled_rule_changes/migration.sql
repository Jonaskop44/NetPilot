-- CreateTable
CREATE TABLE "ScheduledRuleChange" (
    "id" SERIAL NOT NULL,
    "ruleUuid" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "executed" BOOLEAN NOT NULL DEFAULT false,
    "executedAt" TIMESTAMP(3),
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledRuleChange_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScheduledRuleChange" ADD CONSTRAINT "ScheduledRuleChange_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
