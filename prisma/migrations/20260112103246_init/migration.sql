-- CreateTable
CREATE TABLE "User" (
    "user_id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "dob" TIMESTAMP(3),
    "height_cm" DECIMAL(65,30),
    "weight_kg" DECIMAL(65,30),
    "activity_level" TEXT,
    "goal" TEXT,
    "subscription_status" TEXT NOT NULL DEFAULT 'free',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "admin_id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'moderator',
    "is_nutritionist" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "Survey_Response" (
    "survey_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "exercise_frequency" TEXT,
    "allergies" TEXT,
    "goal" TEXT,
    "calculated_bmr" DECIMAL(65,30),
    "target_calories" DECIMAL(65,30),

    CONSTRAINT "Survey_Response_pkey" PRIMARY KEY ("survey_id")
);

-- CreateTable
CREATE TABLE "Food_Item" (
    "food_id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "calories" DECIMAL(65,30),
    "protein_g" DECIMAL(65,30),
    "carbs_g" DECIMAL(65,30),
    "fat_g" DECIMAL(65,30),
    "serving_size" DECIMAL(65,30),
    "serving_unit" TEXT,
    "source" TEXT DEFAULT 'FNRI',
    "cuisine" TEXT,
    "ai_generated" BOOLEAN NOT NULL DEFAULT false,
    "ai_confidence" DECIMAL(65,30),
    "created_by" BIGINT,
    "verified_by_community" BOOLEAN NOT NULL DEFAULT false,
    "verified_by_nutritionist" BIGINT,
    "verified_at" TIMESTAMP(3),
    "is_clinically_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Food_Item_pkey" PRIMARY KEY ("food_id")
);

-- CreateTable
CREATE TABLE "Meal_Log" (
    "log_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "food_id" BIGINT,
    "custom_food_name" TEXT,
    "quantity" DECIMAL(65,30) DEFAULT 1,
    "calories" DECIMAL(65,30),
    "meal_type" TEXT,
    "logged_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "protein_g" DECIMAL(65,30),
    "carbs_g" DECIMAL(65,30),
    "fat_g" DECIMAL(65,30),
    "fiber_g" DECIMAL(65,30),
    "sodium_mg" DECIMAL(65,30),
    "sugar_g" DECIMAL(65,30),
    "cholesterol_mg" DECIMAL(65,30),
    "micronutrients_json" JSONB,

    CONSTRAINT "Meal_Log_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "Meal_Plan" (
    "plan_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "meal_date" TIMESTAMP(3) NOT NULL,
    "meal_type" TEXT NOT NULL,
    "food_id" BIGINT,
    "notes" TEXT,

    CONSTRAINT "Meal_Plan_pkey" PRIMARY KEY ("plan_id")
);

-- CreateTable
CREATE TABLE "Report" (
    "report_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "calories_total" DECIMAL(65,30),
    "protein_total" DECIMAL(65,30),
    "carbs_total" DECIMAL(65,30),
    "fat_total" DECIMAL(65,30),
    "fiber_total" DECIMAL(65,30),
    "sodium_total" DECIMAL(65,30),
    "micronutrients_json" JSONB,
    "file_path" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "reminder_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "message" TEXT NOT NULL,
    "reminder_type" TEXT,
    "scheduled_time" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("reminder_id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "achievement_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "type" TEXT,
    "description" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "achieved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("achievement_id")
);

-- CreateTable
CREATE TABLE "Community_Post" (
    "post_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "content" TEXT NOT NULL,
    "image_url" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Community_Post_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "friendship_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "friend_id" BIGINT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("friendship_id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "challenge_id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "reward_points" INTEGER NOT NULL DEFAULT 0,
    "created_by" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("challenge_id")
);

-- CreateTable
CREATE TABLE "Challenge_Participation" (
    "participation_id" BIGSERIAL NOT NULL,
    "challenge_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'enrolled',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "points_awarded" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Challenge_Participation_pkey" PRIMARY KEY ("participation_id")
);

-- CreateTable
CREATE TABLE "Subscription_Plan" (
    "plan_id" BIGSERIAL NOT NULL,
    "plan_name" TEXT NOT NULL,
    "description" TEXT,
    "monthly_price" DECIMAL(65,30) NOT NULL,
    "annual_price" DECIMAL(65,30),
    "features" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_Plan_pkey" PRIMARY KEY ("plan_id")
);

-- CreateTable
CREATE TABLE "User_Subscription" (
    "user_subscription_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "plan_id" BIGINT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "payment_status" TEXT NOT NULL DEFAULT 'active',
    "renewal_type" TEXT NOT NULL DEFAULT 'manual',

    CONSTRAINT "User_Subscription_pkey" PRIMARY KEY ("user_subscription_id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "payment_id" BIGSERIAL NOT NULL,
    "user_subscription_id" BIGINT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "payment_method" TEXT,
    "transaction_ref" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "Nutrient" (
    "nutrient_id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nutrient_type" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "recommended_male" DECIMAL(65,30),
    "recommended_female" DECIMAL(65,30),
    "importance" TEXT,

    CONSTRAINT "Nutrient_pkey" PRIMARY KEY ("nutrient_id")
);

-- CreateTable
CREATE TABLE "Food_Nutrient" (
    "food_nutrient_id" BIGSERIAL NOT NULL,
    "food_id" BIGINT NOT NULL,
    "nutrient_id" BIGINT NOT NULL,
    "amount_per_serving" DECIMAL(65,30),
    "source" TEXT,

    CONSTRAINT "Food_Nutrient_pkey" PRIMARY KEY ("food_nutrient_id")
);

-- CreateTable
CREATE TABLE "Nutrition_Intake_Daily" (
    "intake_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "intake_date" TIMESTAMP(3) NOT NULL,
    "calories_total" DECIMAL(65,30),
    "protein_total" DECIMAL(65,30),
    "carbs_total" DECIMAL(65,30),
    "fat_total" DECIMAL(65,30),
    "fiber_total" DECIMAL(65,30),
    "sodium_total" DECIMAL(65,30),
    "micronutrients_json" JSONB,
    "computed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Nutrition_Intake_Daily_pkey" PRIMARY KEY ("intake_id")
);

-- CreateTable
CREATE TABLE "Nutritionist_Feedback" (
    "feedback_id" BIGSERIAL NOT NULL,
    "admin_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "intake_id" BIGINT,
    "meal_log_id" BIGINT,
    "comments" TEXT NOT NULL,
    "recommendation" TEXT,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Nutritionist_Feedback_pkey" PRIMARY KEY ("feedback_id")
);

-- CreateTable
CREATE TABLE "GenAI_Insight" (
    "insight_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "meal_log_id" BIGINT,
    "intake_id" BIGINT,
    "prompt" TEXT,
    "insight_text" TEXT NOT NULL,
    "model_name" TEXT,
    "model_confidence" DECIMAL(65,30),
    "reviewed_by_admin" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GenAI_Insight_pkey" PRIMARY KEY ("insight_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "Meal_Log_user_id_logged_at_idx" ON "Meal_Log"("user_id", "logged_at");

-- CreateIndex
CREATE INDEX "Nutrition_Intake_Daily_user_id_intake_date_idx" ON "Nutrition_Intake_Daily"("user_id", "intake_date");

-- AddForeignKey
ALTER TABLE "Survey_Response" ADD CONSTRAINT "Survey_Response_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food_Item" ADD CONSTRAINT "Food_Item_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Admin"("admin_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food_Item" ADD CONSTRAINT "Food_Item_verified_by_nutritionist_fkey" FOREIGN KEY ("verified_by_nutritionist") REFERENCES "Admin"("admin_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meal_Log" ADD CONSTRAINT "Meal_Log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meal_Log" ADD CONSTRAINT "Meal_Log_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "Food_Item"("food_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meal_Plan" ADD CONSTRAINT "Meal_Plan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meal_Plan" ADD CONSTRAINT "Meal_Plan_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "Food_Item"("food_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Community_Post" ADD CONSTRAINT "Community_Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Admin"("admin_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge_Participation" ADD CONSTRAINT "Challenge_Participation_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge"("challenge_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge_Participation" ADD CONSTRAINT "Challenge_Participation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Subscription" ADD CONSTRAINT "User_Subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Subscription" ADD CONSTRAINT "User_Subscription_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Subscription_Plan"("plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_user_subscription_id_fkey" FOREIGN KEY ("user_subscription_id") REFERENCES "User_Subscription"("user_subscription_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food_Nutrient" ADD CONSTRAINT "Food_Nutrient_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "Food_Item"("food_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food_Nutrient" ADD CONSTRAINT "Food_Nutrient_nutrient_id_fkey" FOREIGN KEY ("nutrient_id") REFERENCES "Nutrient"("nutrient_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutrition_Intake_Daily" ADD CONSTRAINT "Nutrition_Intake_Daily_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutritionist_Feedback" ADD CONSTRAINT "Nutritionist_Feedback_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("admin_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutritionist_Feedback" ADD CONSTRAINT "Nutritionist_Feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutritionist_Feedback" ADD CONSTRAINT "Nutritionist_Feedback_intake_id_fkey" FOREIGN KEY ("intake_id") REFERENCES "Nutrition_Intake_Daily"("intake_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutritionist_Feedback" ADD CONSTRAINT "Nutritionist_Feedback_meal_log_id_fkey" FOREIGN KEY ("meal_log_id") REFERENCES "Meal_Log"("log_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenAI_Insight" ADD CONSTRAINT "GenAI_Insight_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenAI_Insight" ADD CONSTRAINT "GenAI_Insight_meal_log_id_fkey" FOREIGN KEY ("meal_log_id") REFERENCES "Meal_Log"("log_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenAI_Insight" ADD CONSTRAINT "GenAI_Insight_intake_id_fkey" FOREIGN KEY ("intake_id") REFERENCES "Nutrition_Intake_Daily"("intake_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenAI_Insight" ADD CONSTRAINT "GenAI_Insight_reviewed_by_admin_fkey" FOREIGN KEY ("reviewed_by_admin") REFERENCES "Admin"("admin_id") ON DELETE SET NULL ON UPDATE CASCADE;
