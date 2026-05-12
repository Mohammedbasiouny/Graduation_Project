import {Injectable} from '@nestjs/common';
import { ExportStudentsDto } from './dto/export-students.dto';
import { Response } from 'express';
import { ExportService } from './sections/export.service';
import { StudentsListService } from './sections/students-list.service';
import { ImportService } from './sections/import.service';


@Injectable()
export class StudentsManagementService {
    constructor(
        private readonly exportService: ExportService,
        private readonly importService: ImportService,
        private readonly studentsList: StudentsListService,) { }

    exportStudentsZip(dto: ExportStudentsDto, res: Response) {
        return this.exportService.exportZip(dto, res);
    }

    importSecurityReview(file: Express.Multer.File, lang: string) {
        return this.importService.importSecurityReview(file, lang);
    }

    findAll(page: number, pageSize: number, withPagination: boolean) {
        return this.studentsList.findAll(page, pageSize, withPagination);
    }

    getStudentProfileByIdAdmin(studentId: number, lang: string) {
        return this.studentsList.getProfileById(studentId, lang);
    }
}
