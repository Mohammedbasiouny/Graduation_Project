import { Injectable, InternalServerErrorException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { StudentCompletionHelper } from '../helpers/student-completion.helper';
import { StudentMapperHelper } from '../helpers/student-mapper.helper';

const STUDENT_LIST_SELECT = {
    id: true,
    fullName: true,
    gender: true,
    applied_at: true,
    is_new: true,
    is_inside_egypt: true,
    isEgyptian: true,
    residencyInfoCompleted: true,
    qualificationId: true,
    academicInfoCompleted: true,
    guardianNationalId: true,
    parentsStatus: true,
    dormType: true,
    medicalReviews: { select: { id: true } }, // ✅ FIXED: Replaced _count with direct select
};

const STUDENT_PROFILE_INCLUDE = {
    documents: true,
    governorate: true,
    policeDepartment: true,
    city: true,
    faculty: true,
    department: true,
    qualification: true,
    educationalDepartment: true,
    highSchoolGovernorateRel: true,
    medicalReviews: true,
    applications: true,
    face_embedding: { select: { id: true } }
};

@Injectable()
export class StudentsListService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly responseHelper: ResponseHelper,
        private readonly completionHelper: StudentCompletionHelper,
        private readonly studentMapper: StudentMapperHelper,
    ) { }

    // ── Get All ───────────────────────────────────────
    async findAll(page: number = 1, pageSize: number = 20, withPagination: boolean = true) {
        try {
            if (!withPagination) return this.findAllWithoutPagination();
            return await this.findAllWithPagination(page, pageSize);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('locations.governorates.FETCH_FAILED');
        }
    }

    // ── Get Profile (Admin) ───────────────────────────
    async getProfileById(studentId: number, lang: string) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: STUDENT_PROFILE_INCLUDE,
        });

        if (!student) {
            return this.responseHelper.success(null, 'student.PROFILE_FETCH_SUCCESS', lang);
        }

        return this.responseHelper.success(
            this.studentMapper.mapProfile(student, false), // false = raw paths for admin
            'student.PROFILE_FETCH_SUCCESS',
            lang,
        );
    }

    // ── Private ───────────────────────────────────────
    private async findAllWithoutPagination() {
        const students = await this.prisma.student.findMany({
            orderBy: { applied_at: 'asc' },
            select: STUDENT_LIST_SELECT,
        });

        return this.buildListResponse(students, 1, students.length, 1, students.length);
    }

    private async findAllWithPagination(page: number, pageSize: number) {
        const skip = (page - 1) * pageSize;

        const [students, totalItems] = await this.prisma.$transaction([
            this.prisma.student.findMany({
                skip,
                take: pageSize,
                orderBy: { applied_at: 'asc' },
                select: STUDENT_LIST_SELECT,
            }),
            this.prisma.student.count(),
        ]);

        const totalPages = Math.ceil(totalItems / pageSize);
        return this.buildListResponse(students, page, pageSize, totalPages, totalItems);
    }

    private buildListResponse(
        students: any[],
        page: number,
        pageSize: number,
        totalPages: number,
        totalItems: number,
    ) {
        const data = students.map(student => ({
            id: student.id,
            full_name: student.fullName,
            gender: student.gender,
            applied_at: student.applied_at,
            is_egyptian_national: student.isEgyptian,
            is_resident_inside_egypt: student.is_inside_egypt,
            is_new_student: student.is_new,
            dorm_type: student.dormType,
            is_completed: this.completionHelper.isCompleted(student),
        }));

        return {
            data,
            meta: {
                pagination: { page, page_size: pageSize, total_pages: totalPages, total_items: totalItems },
                search: null,
                filters: null,
                sorting: null,
            },
        };
    }
}