import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PeriodGuardHelper } from "../helpers/period.guard.helper";
import { DocumentHelper } from "../helpers/document.helper";
import { I18nService } from "nestjs-i18n";
import { ResponseHelper } from "src/response-helper/response-helper";
import { CreateNewStudentAcademicInfoDto, CreateOldStudentAcademicInfoDto } from "../dto";
import { ValidationErrorHelper } from "../helpers/validation-error.helper";

@Injectable()
export class AcademicInfoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly periodGuard: PeriodGuardHelper,
    private readonly docHelper: DocumentHelper,
    private readonly i18n: I18nService,
    private readonly responseHelper: ResponseHelper,
  ) { } readonly

  // ── New Student ───────────────────────────────────
  async saveNewStudent(dto: CreateNewStudentAcademicInfoDto, files, userId: number, lang: string) {
    const student = await this.findStudent(userId);
    await this.periodGuard.guardStudent(student);

    if (student.is_new === null) throw new BadRequestException('student.PRE_UNI_INFO_NOT_COMPLETED');
    if (student.is_new === false) {
      const enrollmentDoc = student.documents.find(d => d.document_type === 'enrollment_proof_image');
      if (enrollmentDoc?.file_path) {
        this.docHelper.deleteFile(enrollmentDoc.file_path);
        await this.deleteDocumentById(enrollmentDoc.id);
      }
    }

    await this.assertCollegeAndDepartment(dto.college, dto.department_or_program);

    return this.persistWithDoc(
      userId,
      student.id,
      {
        facultyId: dto.college,
        departmentId: dto.department_or_program,
        admissionYear: dto.admission_year,
        academicInfoCompleted: true,

        academicYear: null,
        studentIdCode: null,
        educationSystemType: null,
        grade: null,
        totalAcademicGrade: null,
        enrollmentStatus: null,
      },
      files.nomination_card_image?.[0],
      'nomination_card_image',
      'student.NOMINATION_CARD_REQUIRED',
      lang,
    );
  }

  // ── Old Student ───────────────────────────────────
  async saveOldStudent(dto: CreateOldStudentAcademicInfoDto, files, userId: number, lang: string) {
    const student = await this.findStudent(userId);
    await this.periodGuard.guardStudent(student);

    if (student.is_new === true) {
      const preUniDocs = student.documents.filter(d =>
        d.document_type.startsWith('pre_university_certificate')
      );

      preUniDocs.forEach(doc => {
        if (doc.file_path) {
          this.docHelper.deleteFile(doc.file_path);
          this.deleteDocumentById(doc.id);
        }
      });

      const nominationDoc = student.documents.find(d => d.document_type === 'nomination_card_image');
      if (nominationDoc?.file_path) {
        this.docHelper.deleteFile(nominationDoc.file_path);
        await this.deleteDocumentById(nominationDoc.id);
      }
    }

    await this.assertCollegeAndDepartment(dto.college, dto.department_or_program);

    return this.persistWithDoc(
      userId,
      student.id,
      {
        is_new: false,
        facultyId: dto.college,
        departmentId: dto.department_or_program,
        academicYear: dto.study_level,
        studentIdCode: dto.student_code,
        educationSystemType: dto.study_system_type,
        grade: dto.grade,
        totalAcademicGrade: dto.gpa_or_total_score,
        enrollmentStatus: dto.enrollment_status,
        academicInfoCompleted: true,

        highSchoolFromEgypt: null,
        highSchoolTotalGrade: null,
        highSchoolCountry: null,
        highSchoolGovernorate: null,
        highSchoolEducationDistrictId: null,
        qualificationId: null,
        percentage: null,
      },
      files.enrollment_proof_image?.[0],
      'enrollment_proof_image',
      'student.ENROLLMENT_PROOF_REQUIRED',
      lang,
    );
  }

  // ── Shared persist ────────────────────────────────
  // Both new/old student follow same pattern: update student + require one doc
  private async persistWithDoc(
    userId: number,
    studentId: number,
    data: object,
    file: Express.Multer.File | undefined,
    docType: string,
    missingDocError: string,
    lang: string,
  ) {
    const uploadedFiles: string[] = [];

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.student.update({ where: { userId }, data });

        const existingDoc = await tx.document.findFirst({
          where: { student_id: studentId, document_type: docType },
        });

        if (!file && !existingDoc)
          ValidationErrorHelper.field(docType, this.i18n.translate(missingDocError));

        await this.docHelper.replaceSingle(tx, studentId, docType, file, uploadedFiles);
      });

      return this.responseHelper.success({ id: studentId }, 'student.ACADEMIC_INFO_SUCCESS', lang);
    } catch (err) {
      this.docHelper.rollback(uploadedFiles);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('student.ACADEMIC_INFO_ERROR');
    }
  }

  private async assertCollegeAndDepartment(collegeId: number, departmentId: number) {
    const college = await this.prisma.faculty.findUnique({ where: { id: collegeId }, select: { id: true } });
    if (!college) ValidationErrorHelper.field('college', this.i18n.translate('student.COLLEGE_NOT_FOUND'));

    const dept = await this.prisma.departmentProgram.findFirst({
      where: { id: departmentId, faculty_id: collegeId },
      select: { id: true },
    });
    if (!dept) ValidationErrorHelper.field('department_or_program', this.i18n.translate('student.DEPARTMENT_NOT_FOUND'));
  }

  private async findStudent(userId: number) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      select: {
        id: true,
        is_new: true,
        documents: true,
        applied_at: true,
      },
    });
    if (!student) throw new NotFoundException('common.USER_NOT_FOUND');
    return student;
  }
  private async deleteDocumentById(documentId: number): Promise<void> {
    await this.prisma.document.delete({
      where: { id: documentId },
    });
  }
}