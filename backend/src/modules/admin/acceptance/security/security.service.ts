import { 
  Injectable, 
  BadRequestException, 
  NotFoundException, 
  InternalServerErrorException, 
  HttpException, 
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../../prisma/prisma.service'; 
import { UpdateStudentResultDto } from '../dto';
import * as archiver from 'archiver';
import { PassThrough } from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import { Agent } from 'http'; 
import * as FormData from 'form-data';
import axios from 'axios';
import { ResponseHelper } from 'src/response-helper/response-helper';

// Types
interface GenerateStudentsAiTaskInput {
  id: any;
  ssn: any;
  student_id: any;
}

interface StudentsAiTaskServiceResponse {
  task_id: string;
  status: string;
}

@Injectable()
export class AiTaskService {
  private wordServiceHttpAgent: Agent;
  private getFetchErrorDetails: (err: any) => any;
  private isTransientFetchError: (err: any) => boolean;
  private readonly aiServiceInternalBaseUrl: string;
  private readonly aiServicePublicBaseUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly responseHelper: ResponseHelper,
    private readonly configService: ConfigService,
  ) {
    this.wordServiceHttpAgent = new Agent({ keepAlive: true });
    this.getFetchErrorDetails = (err: any) => err?.message ?? String(err);
    this.isTransientFetchError = (err: any) => err?.code === 'ECONNRESET' || err?.code === 'ETIMEDOUT';
    this.aiServiceInternalBaseUrl = (
      this.configService.get<string>('SERVICE_URL') ??
      process.env.SERVICE_URL ??
      'http://127.0.0.1:8000'
    ).replace(/\/+$/, '');
    this.aiServicePublicBaseUrl = (
      this.configService.get<string>('AI_SERVICE_PUBLIC_URL') ??
      process.env.AI_SERVICE_PUBLIC_URL ??
      'http://localhost:8000'
    ).replace(/\/+$/, '');
  }

  // ==========================================
  // STUDENT RESULTS (GET & PUT)
  // ==========================================

  async getStudentResult(studentId: number) {
    const application = await this.prisma.studentApplication.findFirst({
      where: { studentId },
      orderBy: { created_at: 'desc' },
      select: {
        securityReviewStatus: true,       
        candidateForFinalAcceptance: true, 
        finalAcceptance: true,
        messageToStudent: true,
      },
    });

    // 1. Map internal Boolean to frontend String
    let securityString = 'pending';
    if (application?.securityReviewStatus === true) securityString = 'accepted';
    if (application?.securityReviewStatus === false) securityString = 'rejected';

    return {
      security_result_inquiry: securityString,
      candidate_for_final_acceptance: application?.candidateForFinalAcceptance ?? 'pending',
      final_acceptance: application?.finalAcceptance ?? 'pending',
      message_to_student: application?.messageToStudent ?? '',
    };
  }

  async updateStudentResult(studentId: number, dto: UpdateStudentResultDto) {
    const errors: Record<string, string[]> = {};

    // Rule 1: Security controls everything after it
    if (dto.security_result_inquiry === 'rejected' || dto.security_result_inquiry === 'pending') {
      if (dto.candidate_for_final_acceptance !== 'pending' || dto.final_acceptance !== 'pending') {
        errors.candidate_for_final_acceptance = ['Candidate and final acceptance must be pending if security is not accepted.'];
      }
    }

    // Rule 2: Candidate controls final
    if (dto.candidate_for_final_acceptance === 'rejected' || dto.candidate_for_final_acceptance === 'pending') {
      if (dto.final_acceptance !== 'pending') {
        errors.final_acceptance = ['Final acceptance must be pending if candidate is not accepted.'];
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new UnprocessableEntityException({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    let application = await this.prisma.studentApplication.findFirst({
      where: { studentId },
      orderBy: { created_at: 'desc' },
    });

    // create if not exists
    if (!application) {
      const student = await this.prisma.student.findUnique({
        where: { id: studentId },
        select: { applied_at: true },
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      const applicationDate = await this.prisma.applicationDate.findFirst({
        where: {
          startAt: { lte: student.applied_at },
          endAt: { gte: student.applied_at },
        },
      });

      if (!applicationDate) {
        throw new NotFoundException('No application date found for student');
      }

      application = await this.prisma.studentApplication.create({
        data: {
          studentId,
          phaseId: applicationDate.id,
        },
      });
    }

    // MAP: Frontend String -> DB Boolean
    let securityBoolean: boolean | null = null;
    if (dto.security_result_inquiry === 'accepted') securityBoolean = true;
    if (dto.security_result_inquiry === 'rejected') securityBoolean = false;

    await this.prisma.studentApplication.update({
      where: { id: application.id },
      data: {
        securityReviewStatus: securityBoolean, 
        candidateForFinalAcceptance: dto.candidate_for_final_acceptance,
        finalAcceptance: dto.final_acceptance,
        messageToStudent: dto.message_to_student,
      },
    });

    return {
      success: true,
      message: 'Student result updated successfully',
    };
  }

  // ==========================================
  // AI TASK GENERATION
  // ==========================================

  private normalizeStudentsAiTaskInput(
    students: GenerateStudentsAiTaskInput[],
  ): GenerateStudentsAiTaskInput[] {
    const normalized = students
      .map((student) => ({
        id: Number(student?.id),
        ssn: String(student?.ssn ?? '').trim(),
        student_id: Number(student?.student_id),
      }))
      .filter((student) => Number.isFinite(student.id)
        && student.id > 0
        && Number.isFinite(student.student_id)
        && student.student_id > 0
        && student.ssn.length > 0);

    if (!normalized.length) {
      throw new BadRequestException('No valid students provided for AI task generation');
    }

    return normalized;
  }

  private resolveStoredFilePath(filePath: string): string {
    return path.join(process.cwd(), filePath.replace(/^[\\/]+/, ''));
  }

  private groupAiDocumentsByStudentId(
    documents: Array<{ student_id: number; document_type: string; file_path: string }>,
  ): Map<number, Array<{ document_type: string; file_path: string }>> {
    const docsByStudentId = new Map<number, Array<{ document_type: string; file_path: string }>>();

    for (const document of documents) {
      const list = docsByStudentId.get(document.student_id) ?? [];
      list.push({
        document_type: document.document_type,
        file_path: document.file_path,
      });
      docsByStudentId.set(document.student_id, list);
    }

    return docsByStudentId;
  }

  private appendAiTaskStudentDocumentsToArchive(
    archive: any,
    students: GenerateStudentsAiTaskInput[],
    docsByStudentId: Map<number, Array<{ document_type: string; file_path: string }>>,
  ): number {
    let filesCount = 0;

    for (const student of students) {
      const entries = this.buildAiArchiveEntriesForStudent(student, docsByStudentId);
      for (const entry of entries) {
        archive.file(entry.absPath, {
          name: entry.zipPath,
        });
        filesCount += 1;
      }
    }

    return filesCount;
  }

  private buildAiArchiveEntriesForStudent(
    student: GenerateStudentsAiTaskInput,
    docsByStudentId: Map<number, Array<{ document_type: string; file_path: string }>>,
  ): Array<{ absPath: string; zipPath: string }> {
    const folderName = `${student.id}_${student.ssn}`;
    const studentDocuments = docsByStudentId.get(student.student_id) ?? [];
    const perTypeCount = new Map<string, number>();
    const entries: Array<{ absPath: string; zipPath: string }> = [];

    for (const doc of studentDocuments) {
      const zipEntry = this.buildAiArchiveEntryForDocument(doc, folderName, perTypeCount);
      if (!zipEntry) continue;
      entries.push(zipEntry);
    }

    return entries;
  }

  private buildAiArchiveEntryForDocument(
    doc: { document_type: string; file_path: string },
    folderName: string,
    perTypeCount: Map<string, number>,
  ): { absPath: string; zipPath: string } | null {
    if (!doc.file_path) return null;

    const absPath = this.resolveStoredFilePath(doc.file_path);
    if (!fs.existsSync(absPath)) return null;

    const extWithDot = path.extname(doc.file_path);
    const ext = extWithDot ? extWithDot.slice(1) : '';

    const nextCount = (perTypeCount.get(doc.document_type) ?? 0) + 1;
    perTypeCount.set(doc.document_type, nextCount);

    const indexedType = nextCount === 1
      ? doc.document_type
      : `${doc.document_type}_${nextCount}`;
    const fileName = ext ? `${indexedType}.${ext}` : indexedType;

    return {
      absPath,
      zipPath: `${folderName}/${fileName}`,
    };
  }

  private async buildStudentsAiTaskZip(
    students: GenerateStudentsAiTaskInput[],
  ): Promise<Buffer> {
    const requiredDocumentTypes = ['national_id_front', 'guardian_id_front'];
    const studentIds = [...new Set(students.map((student) => student.student_id))];

    const documents = await this.prisma.document.findMany({
      where: {
        student_id: { in: studentIds },
        document_type: { in: requiredDocumentTypes },
      },
      select: {
        student_id: true,
        document_type: true,
        file_path: true,
      },
    });

    const docsByStudentId = this.groupAiDocumentsByStudentId(documents);

    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    const out = new PassThrough();
    const chunks: Buffer[] = [];
    const zipBufferPromise = new Promise<Buffer>((resolve, reject) => {
      archive.on('error', reject);
      out.on('error', reject);
      out.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
      out.on('end', () => resolve(Buffer.concat(chunks)));
    });

    archive.pipe(out);

    const filesCount = this.appendAiTaskStudentDocumentsToArchive(
      archive,
      students,
      docsByStudentId,
    );

    if (!filesCount) {
      archive.abort();
      throw new NotFoundException('No student documents found for AI task generation');
    }

    await archive.finalize();
    return await zipBufferPromise;
  }

  private async requestStudentsAiTask(
    studentsZipBuffer: Buffer,
  ): Promise<StudentsAiTaskServiceResponse> {
    const endpoint = `${this.aiServiceInternalBaseUrl}/generate-word`;

    const sendRequest = async () => {
      const form = new FormData();

      form.append('zip_file', studentsZipBuffer, {
        filename: 'students.zip',
        contentType: 'application/zip',
      });

      return axios.post(endpoint, form, {
        headers: {
          ...form.getHeaders(),
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });
    };

    let response;

    try {
      response = await sendRequest();
    } catch (err: any) {
      const details = err?.message ?? String(err);

      // retry only transient errors
      if (err?.code !== 'ECONNRESET' && err?.code !== 'ETIMEDOUT') {
        throw new BadRequestException(`AI task service failed: ${details}`);
      }

      response = await sendRequest();
    }

    const data = response.data;

    if (!data?.task_id || !data?.status) {
      throw new InternalServerErrorException(
        'Invalid AI task response payload',
      );
    }

    return data;
  }


  public async generateStudentsAiTask(
    students: GenerateStudentsAiTaskInput[],
    userId: number,
    fileName: string,
  ): Promise<{ id: number; task_id: string; status: string; file_name: string; user_id: number }> {
    try {
      if (!Array.isArray(students) || students.length === 0) {
        throw new BadRequestException('students must be a non-empty array');
      }

      const normalizedFileName = String(fileName ?? '').trim();
      if (!normalizedFileName) {
        throw new BadRequestException('fileName must be a non-empty string');
      }

      const normalizedStudents = this.normalizeStudentsAiTaskInput(students);
      const zipBuffer = await this.buildStudentsAiTaskZip(normalizedStudents);
      const aiTask = await this.requestStudentsAiTask(zipBuffer);

      const createdTask = await this.prisma.aiTask.create({
        data: {
          task_id: aiTask.task_id,
          status: aiTask.status,
          file_name: normalizedFileName,
          user_id: userId,
        },
        select: {
          id: true,
          task_id: true,
          status: true,
          file_name: true,
          user_id: true,
        },
      });

      return createdTask;
    } catch (err: any) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err?.message ?? 'Failed to generate AI task');
    }
  }

  async findAiTasks(lang, userId: number) {
    try {
      // 1. Get task info from DB (include name)
      const dbTasks = await this.prisma.aiTask.findMany({
        where: { user_id: userId },
        select: {
          task_id: true,
          file_name: true, // ✅ important
        },
      });

      // 2. Create lookup map: task_id -> name
      const taskMap = new Map(
        dbTasks.map((t) => [t.task_id, t.file_name]),
      );

      const taskIds = new Set(dbTasks.map((t) => t.task_id));

      // 3. Fetch external tasks
      const { data } = await axios.get(`${this.aiServiceInternalBaseUrl}/tasks`);

      const allTasks = Object.values(data || {});

      // 4. Merge + filter
      const items = allTasks
        .filter((task: any) => taskIds.has(task.id))
        .map((task: any) => ({
          task_id: task.id,
          file_name: taskMap.get(task.id) || null, // ✅ from DB
          status: task.status,
          created_at: task.created_at,
          updated_at: task.updated_at,
          output_path: `${this.aiServicePublicBaseUrl}/tasks/${task.id}/download`,
        }))
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime(),
        );

      return this.responseHelper.success(items, 'ai_tasks.LIST', lang, {
        pagination: {
          page: 1,
          page_size: items.length,
          total_pages: 1,
          total_items: items.length,
        },
        filters: null,
        search: null,
        sorting: null,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('ai_tasks.LIST_FAILED');
    }
  }
  

}