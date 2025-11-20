-- CreateTable
CREATE TABLE "UserPromotion" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "promotedById" INTEGER NOT NULL,
    "toRole" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPromotion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPromotion_userId_promotedById_toRole_key" ON "UserPromotion"("userId", "promotedById", "toRole");

-- AddForeignKey
ALTER TABLE "UserPromotion" ADD CONSTRAINT "UserPromotion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPromotion" ADD CONSTRAINT "UserPromotion_promotedById_fkey" FOREIGN KEY ("promotedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
