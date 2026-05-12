import { Injectable } from "@nestjs/common";
import { encryptFilePath } from "src/utils";

@Injectable()
export class StudentMapperHelper {

  mapProfile(student: any, useEncryptedPaths = false): object {
    return {
      student:             this.mapMeta(student),
      personal_info:       this.mapPersonalInfo(student),
      residence_info:      this.mapResidenceInfo(student),
      pre_university_info: this.mapPreUniversityInfo(student),
      academic_info:       this.mapAcademicInfo(student),
      guardian_info:       this.mapGuardianInfo(student),
      parents_status:      this.mapParentsStatus(student),
      housing_info:        this.mapHousingInfo(student),
      medical_report:      student.medicalReviews,
      face_embedding:          student.face_embedding ? true : false,
      documents:           this.mapDocuments(student.documents, useEncryptedPaths),
      application_result:  this.mapApplicationResult(student.applications?.[0] ?? null),
    };
  }

  private mapMeta(student: any) {
    return {
      id: student.id,
      is_egyptian_national: student.isEgyptian,
      is_resident_inside_egypt: student.is_inside_egypt,
      is_new_student: student.is_new,
      applied_at: student.applied_at,
    };
    
  }

  private mapPersonalInfo(student: any) {
    return student.isEgyptian
      ? {
          full_name: student.fullName,
          national_id: student.nationalId,
          gender: student.gender,
          religion: student.religion,
          birth_city: student.birthCity,
          birth_country: student.placeOfBirth,
          mobile_number: student.phoneNumber,
          date_of_birth: student.dateOfBirth,
          landline_number: student.telephone,
          nationality: student.nationality,
          is_egyptian: true,
        }
      : {
          full_name: student.fullName,
          passport_number: student.passportNumber,
          nationality: student.nationality,
          passport_issuing_country: student.passportIssuingCountry,
          religion: student.religion,
          place_of_birth: student.placeOfBirth,
          date_of_birth: student.dateOfBirth,
          gender: student.gender,
          mobile_number: student.phoneNumber,
          is_egyptian: false,
        };
  }

  private mapResidenceInfo(student: any) {
    if (!student.residencyInfoCompleted) return null;
    return student.is_inside_egypt
      ? {
          is_inside_egypt: true,
          governorate: student.governorate?.id,
          governorate_name: student.governorate?.name,
          district_or_center: student.policeDepartment?.id,
          district_or_center_name: student.policeDepartment?.name,
          city_or_village: student.city?.id,
          city_or_village_name: student.city?.name,
          detailed_address: student.fullAddress,
        }
      : {
          is_inside_egypt: false,
          country: student.countryOfResidence,
          detailed_address: student.fullAddress,
        };
  }

  private mapPreUniversityInfo(student: any) {
    if (!student.qualificationId) return null;
    return student.highSchoolFromEgypt
      ? {
          is_inside_egypt: true,
          certificate_type: student.qualification?.id,
          certificate_name: student.qualification?.name,
          total_score: student.highSchoolTotalGrade,
          certificate_country: student.highSchoolCountry,
          governorate: student.highSchoolGovernorateRel?.id,
          governorate_name: student.highSchoolGovernorateRel?.name,
          educational_administration: student.educationalDepartment?.id,
          educational_administration_name: student.educationalDepartment?.name,
          percentage: student.percentage,
        }
      : {
          is_inside_egypt: false,
          certificate_type: student.qualification?.id,
          certificate_name: student.qualification?.name,
          certificate_country: student.highSchoolCountry,
          total_score: student.highSchoolTotalGrade,
          percentage: student.percentage,
        };
  }

  private mapAcademicInfo(student: any) {
    if (!student.academicInfoCompleted) return null;
    return student.is_new
      ? {
          is_new: true,
          college: student.faculty?.id,
          college_name: student.faculty?.name,
          department_or_program: student.department?.id,
          department_or_program_name: student.department?.name,
          admission_year: student.admissionYear,
        }
      : {
          is_new: false,
          college: student.faculty?.id,
          college_name: student.faculty?.name,
          department_or_program: student.department?.id,
          department_or_program_name: student.department?.name,
          study_level: student.academicYear,
          student_code: student.studentIdCode,
          study_system_type: student.educationSystemType,
          gpa_or_total_score: student.totalAcademicGrade,
          enrollment_status: student.enrollmentStatus,
          grade: student.grade,
        };
  }

  private mapGuardianInfo(student: any) {
    if (!student.guardianNationalId) return null;
    return student.isGuardianEgyptian
      ? {
          is_egyptian: true,
          full_name: student.guardianName,
          national_id: student.guardianNationalId,
          job_title: student.guardianOccupation,
          mobile_number: student.guardianPhoneNumber,
          nationality: student.guardianNationality,
          relationship: student.guardianRelationship,
        }
      : {
          is_egyptian: false,
          full_name: student.guardianName,
          identity_number: student.guardianNationalId,
          job_title: student.guardianOccupation,
          nationality: student.guardianNationality,
          mobile_number: student.guardianPhoneNumber,
          relationship: student.guardianRelationship,
        };
  }

  private mapParentsStatus(student: any) {
    if (!student.parentsStatus) return null;
    return {
      parents_status: student.parentsStatus,
      family_residency_abroad: student.parentsOutsideEgypt,
    };
  }

  private mapHousingInfo(student: any) {
    if (!student.dormType) return null;
    return { housing_type: student.dormType, meals: student.requiresMeals };
  }

  // useEncryptedPaths=true for student-facing, false for admin
  mapDocuments(documents: any[], useEncryptedPaths = false): Record<string, string | string[]> {
    return documents.reduce((acc, doc) => {
      const fullPath = useEncryptedPaths
        ? `${process.env.SERVER_URL}/files/${encryptFilePath(doc.file_path)}`
        : `${process.env.SERVER_URL}${doc.file_path}`;

      if (doc.document_type.startsWith('pre_university_certificate')) {
        if (!acc['pre_university_certificate']) acc['pre_university_certificate'] = [];
        (acc['pre_university_certificate'] as string[]).push(fullPath);
      } else {
        acc[doc.document_type] = fullPath;
      }
      return acc;
    }, {} as Record<string, string | string[]>);
  }

  private mapApplicationResult(student: any) {
    // 1. Map internal Boolean to frontend String
    let securityString = 'pending';
    if (student?.securityReviewStatus === true) securityString = 'accepted';
    if (student?.securityReviewStatus === false) securityString = 'rejected';

    return {
      security_result_inquiry: securityString,
      candidate_for_final_acceptance: student?.candidateForFinalAcceptance ?? 'pending',
      final_acceptance: student?.finalAcceptance ?? 'pending',
      message_to_student: student?.messageToStudent ?? '',
    };
  }
}
