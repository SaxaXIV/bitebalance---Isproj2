-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'fnri';

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "dailyCalories" INTEGER,
ADD COLUMN     "dietType" TEXT,
ADD COLUMN     "sex" TEXT;
