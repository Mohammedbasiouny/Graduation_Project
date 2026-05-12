-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('student', 'supervisor', 'security', 'cafeteria', 'maintenance', 'medical', 'admin');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "public"."University" AS ENUM ('hu', 'hnu', 'hitu');

-- CreateEnum
CREATE TYPE "public"."RoomType" AS ENUM ('regular', 'premium', 'medical', 'studying');

-- CreateEnum
CREATE TYPE "public"."MealCategory" AS ENUM ('breakfast', 'lunch', 'dinner', 'suhoor');

-- CreateEnum
CREATE TYPE "public"."DayType" AS ENUM ('normal', 'exam', 'ramadan');

-- CreateEnum
CREATE TYPE "public"."StudentType" AS ENUM ('new', 'old', 'all');

-- CreateEnum
CREATE TYPE "public"."AcceptanceStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "public"."ReservationStatus" AS ENUM ('pending', 'completed', 'no_show', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."ReservationType" AS ENUM ('auto', 'student', 'staff');

-- CreateEnum
CREATE TYPE "public"."FacultyLocation" AS ENUM ('inside', 'outside');

-- CreateEnum
CREATE TYPE "public"."QRCodeStatus" AS ENUM ('active', 'scanned', 'expired');

-- CreateEnum
CREATE TYPE "public"."AutoReservationTarget" AS ENUM ('inside', 'outside', 'both');

-- CreateEnum
CREATE TYPE "public"."ResidencyStatus" AS ENUM ('pending_assignment', 'active', 'checked_out', 'term_ended');

-- CreateEnum
CREATE TYPE "public"."AttendanceMethod" AS ENUM ('face_scan', 'manual');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "password_hash" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "full_name" TEXT,
    "ssn" BIGINT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "otp" TEXT,
    "otpExpiresAt" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "university" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ai_tasks" (
    "id" SERIAL NOT NULL,
    "task_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserPermission" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "permissions" JSONB NOT NULL,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "status_code" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."governorates" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "distanceFromCairo" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "governorates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."police_departments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "governorate_id" INTEGER NOT NULL,
    "acceptance_status" BOOLEAN NOT NULL DEFAULT true,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "police_departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "governorate_id" INTEGER NOT NULL,
    "police_department_id" INTEGER NOT NULL,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."educational_departments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "acceptance_status" BOOLEAN NOT NULL DEFAULT true,
    "governorate_id" INTEGER NOT NULL,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "educational_departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."faculties" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "university" "public"."University" NOT NULL,
    "is_off_campus" BOOLEAN NOT NULL DEFAULT false,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faculties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."department_programs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "faculty_id" INTEGER NOT NULL,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "department_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pre_university_qualifications" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "degree" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pre_university_qualifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."students" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "personalInfoCompleted" BOOLEAN NOT NULL DEFAULT false,
    "residencyInfoCompleted" BOOLEAN NOT NULL DEFAULT false,
    "academicInfoCompleted" BOOLEAN NOT NULL DEFAULT false,
    "nationalId" TEXT,
    "fullName" TEXT,
    "religion" TEXT,
    "gender" "public"."Gender",
    "dateOfBirth" TIMESTAMP(3),
    "placeOfBirth" TEXT,
    "birthCity" TEXT,
    "phoneNumber" TEXT,
    "telephone" TEXT,
    "fullAddress" TEXT,
    "isEgyptian" BOOLEAN,
    "is_inside_egypt" BOOLEAN,
    "countryOfResidence" TEXT,
    "passportIssuingCountry" TEXT,
    "governorateId" INTEGER,
    "policeDepartmentId" INTEGER,
    "cityId" INTEGER,
    "passportNumber" TEXT,
    "nationality" TEXT,
    "highSchoolFromEgypt" BOOLEAN,
    "highSchoolTotalGrade" DOUBLE PRECISION,
    "highSchoolCountry" TEXT,
    "highSchoolGovernorate" INTEGER,
    "highSchoolEducationDistrictId" INTEGER,
    "qualificationId" INTEGER,
    "grade" TEXT,
    "percentage" DOUBLE PRECISION,
    "is_new" BOOLEAN,
    "facultyId" INTEGER,
    "departmentId" INTEGER,
    "admissionYear" TEXT,
    "studentIdCode" TEXT,
    "academicYear" TEXT,
    "educationSystemType" TEXT,
    "totalAcademicGrade" DOUBLE PRECISION,
    "enrollmentStatus" TEXT,
    "isGuardianEgyptian" BOOLEAN,
    "guardianName" TEXT,
    "guardianRelationship" TEXT,
    "guardianOccupation" TEXT,
    "guardianNationalId" TEXT,
    "guardianPhoneNumber" TEXT,
    "guardianNationality" TEXT,
    "parentsStatus" TEXT,
    "parentsOutsideEgypt" BOOLEAN,
    "dormType" TEXT,
    "requiresMeals" BOOLEAN,
    "hasPunishment" BOOLEAN DEFAULT false,
    "feeExpelled" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applied_at" TIMESTAMP(3),

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."documents" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "document_type" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."medical_reviews" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "blood_pressure" BOOLEAN NOT NULL,
    "blood_pressure_details" TEXT,
    "diabetes" BOOLEAN NOT NULL,
    "diabetes_details" TEXT,
    "heart_disease" BOOLEAN NOT NULL,
    "heart_disease_details" TEXT,
    "immune_diseases" BOOLEAN NOT NULL,
    "immune_diseases_details" TEXT,
    "mental_health" BOOLEAN NOT NULL,
    "mental_health_details" TEXT,
    "other_diseases" BOOLEAN NOT NULL,
    "other_diseases_details" TEXT,
    "mental_health_treatment" BOOLEAN NOT NULL,
    "mental_health_treatment_details" TEXT,
    "receiving_treatment" BOOLEAN NOT NULL,
    "receiving_treatment_details" TEXT,
    "allergies" BOOLEAN NOT NULL,
    "allergies_details" TEXT,
    "special_needs" BOOLEAN NOT NULL,
    "special_needs_details" TEXT,
    "adapt_to_new_environments" BOOLEAN NOT NULL,
    "prefer_solitude" BOOLEAN NOT NULL,
    "behavioral_problems" BOOLEAN NOT NULL,
    "suspension_history" BOOLEAN NOT NULL,
    "shared_room_adaptation" BOOLEAN NOT NULL,
    "social_support" BOOLEAN NOT NULL,
    "stimulants_or_sedatives" BOOLEAN NOT NULL,
    "social_media_usage" BOOLEAN NOT NULL,
    "sadness_without_reason" TEXT NOT NULL,
    "anxiety_or_stress" TEXT NOT NULL,
    "concentration_difficulty" TEXT NOT NULL,
    "sleep_problems" TEXT NOT NULL,
    "loss_of_interest" TEXT NOT NULL,
    "self_harm_thoughts" TEXT NOT NULL,
    "appetite_changes" TEXT NOT NULL,
    "anger_outbursts" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."application_dates" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "university" TEXT,
    "studentType" "public"."StudentType" NOT NULL DEFAULT 'new',
    "preliminaryResultAnnounced" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "application_dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."student_applications" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "phaseId" INTEGER NOT NULL,
    "status" "public"."AcceptanceStatus" NOT NULL DEFAULT 'pending',
    "systemRecommendation" TEXT,
    "flagReasons" TEXT,
    "securityReviewStatus" BOOLEAN,
    "messageToStudent" TEXT,
    "candidateForFinalAcceptance" TEXT DEFAULT 'pending',
    "finalAcceptance" TEXT DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."acceptance_sheet_exports" (
    "id" SERIAL NOT NULL,
    "phaseId" INTEGER NOT NULL,
    "exportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exportedBy" INTEGER,
    "exportedByName" TEXT,
    "segmentsExported" TEXT[],
    "totalStudents" INTEGER,
    "aiTasksFired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "acceptance_sheet_exports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."acceptance_sheet_imports" (
    "id" SERIAL NOT NULL,
    "phaseId" INTEGER NOT NULL,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "importedBy" INTEGER,
    "importedByName" TEXT,
    "totalRows" INTEGER NOT NULL,
    "acceptedCount" INTEGER NOT NULL DEFAULT 0,
    "rejectedCount" INTEGER NOT NULL DEFAULT 0,
    "securityRejectedCount" INTEGER NOT NULL DEFAULT 0,
    "errors" JSONB,
    "rawFileName" TEXT,

    CONSTRAINT "acceptance_sheet_imports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."settings" (
    "id" SERIAL NOT NULL,
    "restaurant_status" BOOLEAN NOT NULL DEFAULT true,
    "application_period_open" BOOLEAN NOT NULL DEFAULT false,
    "application_period_open_changed_at" TIMESTAMP(3) NOT NULL,
    "auto_meal_reserve" BOOLEAN NOT NULL DEFAULT false,
    "admission_results_announced" BOOLEAN NOT NULL DEFAULT false,
    "university_housing_started" BOOLEAN NOT NULL DEFAULT false,
    "female_visits_available" BOOLEAN NOT NULL DEFAULT false,
    "online_payment_available" BOOLEAN NOT NULL DEFAULT false,
    "attendance_start" TIME(0) NOT NULL,
    "attendance_end" TIME(0) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."buildings" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."Gender" NOT NULL,
    "floors_count" INTEGER NOT NULL DEFAULT 1,
    "is_available_for_stay" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."rooms" (
    "id" SERIAL NOT NULL,
    "building_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."RoomType" NOT NULL,
    "floor" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "description" TEXT,
    "is_available_for_stay" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."meals" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "public"."MealCategory" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."meal_day_schedules" (
    "id" SERIAL NOT NULL,
    "day_type" "public"."DayType" NOT NULL,
    "booking_start_time" TIMESTAMP(3) NOT NULL,
    "booking_end_time" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meal_day_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."meal_slots" (
    "id" SERIAL NOT NULL,
    "schedule_id" INTEGER NOT NULL,
    "meal_id" INTEGER NOT NULL,
    "delivery_start_time" TIMESTAMP(3) NOT NULL,
    "delivery_end_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meal_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."meal_reservations" (
    "id" SERIAL NOT NULL,
    "resident_id" INTEGER NOT NULL,
    "meal_slot_id" INTEGER NOT NULL,
    "status" "public"."ReservationStatus" NOT NULL DEFAULT 'pending',
    "reservation_type" "public"."ReservationType" NOT NULL,
    "faculty_location" "public"."FacultyLocation" NOT NULL,
    "created_by_staff_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meal_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."meal_qr_codes" (
    "id" SERIAL NOT NULL,
    "reservation_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "status" "public"."QRCodeStatus" NOT NULL DEFAULT 'active',
    "scanned_at" TIMESTAMP(3),
    "is_manual_override" BOOLEAN NOT NULL DEFAULT false,
    "overridden_by_id" INTEGER,
    "override_reason" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meal_qr_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."restaurant_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "is_open" BOOLEAN NOT NULL DEFAULT true,
    "auto_reservation_enabled" BOOLEAN NOT NULL DEFAULT true,
    "auto_reservation_target" "public"."AutoReservationTarget" NOT NULL DEFAULT 'inside',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "restaurant_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."residents" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "application_id" INTEGER NOT NULL,
    "building_id" INTEGER,
    "room_id" INTEGER,
    "status" "public"."ResidencyStatus" NOT NULL DEFAULT 'pending_assignment',
    "move_in_date" TIMESTAMP(3),
    "move_out_date" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "residents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."face_embeddings" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "embedding" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "face_embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."attendance_logs" (
    "id" SERIAL NOT NULL,
    "resident_id" INTEGER NOT NULL,
    "logged_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" "public"."AttendanceMethod" NOT NULL DEFAULT 'face_scan',
    "confidence" DOUBLE PRECISION,
    "notes" TEXT,

    CONSTRAINT "attendance_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_ssn_key" ON "public"."User"("ssn");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ai_tasks_task_id_key" ON "public"."ai_tasks"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_userId_key" ON "public"."UserPermission"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "public"."audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_role_idx" ON "public"."audit_logs"("role");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "public"."audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_method_idx" ON "public"."audit_logs"("method");

-- CreateIndex
CREATE INDEX "audit_logs_status_idx" ON "public"."audit_logs"("status");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "public"."audit_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "governorates_name_key" ON "public"."governorates"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pre_university_qualifications_name_key" ON "public"."pre_university_qualifications"("name");

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "public"."students"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "students_nationalId_key" ON "public"."students"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "medical_reviews_student_id_key" ON "public"."medical_reviews"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "medical_reviews_user_id_key" ON "public"."medical_reviews"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_applications_studentId_phaseId_key" ON "public"."student_applications"("studentId", "phaseId");

-- CreateIndex
CREATE UNIQUE INDEX "buildings_name_key" ON "public"."buildings"("name");

-- CreateIndex
CREATE UNIQUE INDEX "meals_name_key" ON "public"."meals"("name");

-- CreateIndex
CREATE INDEX "meal_slots_schedule_id_idx" ON "public"."meal_slots"("schedule_id");

-- CreateIndex
CREATE UNIQUE INDEX "meal_slots_schedule_id_meal_id_key" ON "public"."meal_slots"("schedule_id", "meal_id");

-- CreateIndex
CREATE INDEX "meal_reservations_resident_id_idx" ON "public"."meal_reservations"("resident_id");

-- CreateIndex
CREATE UNIQUE INDEX "meal_reservations_resident_id_meal_slot_id_key" ON "public"."meal_reservations"("resident_id", "meal_slot_id");

-- CreateIndex
CREATE UNIQUE INDEX "meal_qr_codes_reservation_id_key" ON "public"."meal_qr_codes"("reservation_id");

-- CreateIndex
CREATE UNIQUE INDEX "meal_qr_codes_token_key" ON "public"."meal_qr_codes"("token");

-- CreateIndex
CREATE UNIQUE INDEX "residents_application_id_key" ON "public"."residents"("application_id");

-- CreateIndex
CREATE INDEX "residents_student_id_idx" ON "public"."residents"("student_id");

-- CreateIndex
CREATE INDEX "residents_status_idx" ON "public"."residents"("status");

-- CreateIndex
CREATE UNIQUE INDEX "residents_student_id_application_id_key" ON "public"."residents"("student_id", "application_id");

-- CreateIndex
CREATE UNIQUE INDEX "face_embeddings_student_id_key" ON "public"."face_embeddings"("student_id");

-- CreateIndex
CREATE INDEX "attendance_logs_resident_id_idx" ON "public"."attendance_logs"("resident_id");

-- CreateIndex
CREATE INDEX "attendance_logs_logged_at_idx" ON "public"."attendance_logs"("logged_at");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_logs_resident_id_logged_at_key" ON "public"."attendance_logs"("resident_id", "logged_at");

-- AddForeignKey
ALTER TABLE "public"."ai_tasks" ADD CONSTRAINT "ai_tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."police_departments" ADD CONSTRAINT "police_departments_governorate_id_fkey" FOREIGN KEY ("governorate_id") REFERENCES "public"."governorates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cities" ADD CONSTRAINT "cities_governorate_id_fkey" FOREIGN KEY ("governorate_id") REFERENCES "public"."governorates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cities" ADD CONSTRAINT "cities_police_department_id_fkey" FOREIGN KEY ("police_department_id") REFERENCES "public"."police_departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."educational_departments" ADD CONSTRAINT "educational_departments_governorate_id_fkey" FOREIGN KEY ("governorate_id") REFERENCES "public"."governorates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."department_programs" ADD CONSTRAINT "department_programs_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_governorateId_fkey" FOREIGN KEY ("governorateId") REFERENCES "public"."governorates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_policeDepartmentId_fkey" FOREIGN KEY ("policeDepartmentId") REFERENCES "public"."police_departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_highSchoolGovernorate_fkey" FOREIGN KEY ("highSchoolGovernorate") REFERENCES "public"."governorates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_highSchoolEducationDistrictId_fkey" FOREIGN KEY ("highSchoolEducationDistrictId") REFERENCES "public"."educational_departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_qualificationId_fkey" FOREIGN KEY ("qualificationId") REFERENCES "public"."pre_university_qualifications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "public"."faculties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."department_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medical_reviews" ADD CONSTRAINT "medical_reviews_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medical_reviews" ADD CONSTRAINT "medical_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_applications" ADD CONSTRAINT "student_applications_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_applications" ADD CONSTRAINT "student_applications_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "public"."application_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."acceptance_sheet_exports" ADD CONSTRAINT "acceptance_sheet_exports_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "public"."application_dates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."acceptance_sheet_imports" ADD CONSTRAINT "acceptance_sheet_imports_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "public"."application_dates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rooms" ADD CONSTRAINT "rooms_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."meal_slots" ADD CONSTRAINT "meal_slots_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "public"."meal_day_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."meal_slots" ADD CONSTRAINT "meal_slots_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "public"."meals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."meal_reservations" ADD CONSTRAINT "meal_reservations_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "public"."residents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."meal_reservations" ADD CONSTRAINT "meal_reservations_meal_slot_id_fkey" FOREIGN KEY ("meal_slot_id") REFERENCES "public"."meal_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."meal_reservations" ADD CONSTRAINT "meal_reservations_created_by_staff_id_fkey" FOREIGN KEY ("created_by_staff_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."meal_qr_codes" ADD CONSTRAINT "meal_qr_codes_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "public"."meal_reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."meal_qr_codes" ADD CONSTRAINT "meal_qr_codes_overridden_by_id_fkey" FOREIGN KEY ("overridden_by_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."residents" ADD CONSTRAINT "residents_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."residents" ADD CONSTRAINT "residents_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "public"."student_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."residents" ADD CONSTRAINT "residents_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."residents" ADD CONSTRAINT "residents_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."face_embeddings" ADD CONSTRAINT "face_embeddings_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attendance_logs" ADD CONSTRAINT "attendance_logs_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "public"."residents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
