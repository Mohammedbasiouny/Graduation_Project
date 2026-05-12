import { Workbook, Worksheet, Row, Cell, Borders } from 'exceljs';
import { StudentRankedDto } from '../strategies/flagging/base-flagging.strategy';
import * as i18n from '../../../../i18n/ar/acceptance.json';
import { ACCEPTANCE_CONSTANTS } from '../constants/acceptance.constants';

// Standard thin border for black and white readability
const BORDER_STYLE: Partial<Borders> = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};

// Dynamically build the dropdown string from i18n
const STATUS_DROPDOWN = `"${(i18n.sheet as any).statuses.accepted},${(i18n.sheet as any).statuses.rejected},${(i18n.sheet as any).statuses.pending}"`;

// ==================== Helper: Map Student to Row Values ====================
function mapStudentToRow(
  student: any,
  index: number,
  isNew: boolean,
): any[] {
  const studentType = student.nationalId 
    ? i18n.sheet.student_types.egyptian 
    : i18n.sheet.student_types.foreign;
    
  const nationalOrPassportId = student.nationalId || student.passportNumber || '';

  let totalGrade: number | string = '';
  if (isNew) {
    totalGrade = student.highSchoolTotalGrade ?? '';
  }

  const gradeTextMap = (i18n as any).grades as Record<string, string>;

  const baseValues = [
    index + 1,                                   
    student.id || '',                             
    nationalOrPassportId,                         
    student.fullName || '',                       
    studentType,                                  
    student.faculty?.name || '',                  
  ];

  if (isNew) {
    baseValues.push(
      totalGrade,                                 
      student.qualification?.name || '',          
    );
  } else {
    // Map the numeric grade to text, fallback to original if not matched
    const gradeStr = student.grade?.toString() || '';
    const mappedGrade = gradeTextMap?.[gradeStr] || gradeStr;

    const academicYearMap: Record<string, string> = {
      preparatory: 'إعدادي',
      first_year: 'الفرقة الأولى',
      second_year: 'الفرقة الثانية',
      third_year: 'الفرقة الثالثة',
      fourth_year: 'الفرقة الرابعة',
      fifth_year: 'الفرقة الخامسة',
      sixth_year: 'الفرقة السادسة',
    };
    baseValues.push(
      academicYearMap[student.academicYear] || student.academicYear || '',
      mappedGrade,
    );
  }

  // Location Data
  baseValues.push(
    student.governorate?.name || '',              
    student.policeDepartment?.name || '', // Markaz              
    student.city?.name || '',             // Village             
  );

  // High School Governorate (New Students Only)
  if (isNew) {
    baseValues.push(student.highSchoolGovernorateRel?.name || ''); 
  }

  // Guardian Data
  baseValues.push(
    student.guardianNationalId || '',             
    student.guardianName || '',                   
    student.guardianRelationship || '',           
    student.guardianOccupation || '',             
  );

  // Both new and returning: 3 admin-input columns, all blank
  baseValues.push(
    '', // حالة الاستعلام الامني — admin fills
    '', // قرار الإدارة — admin fills
    '', // أسباب القبول/الرفض — admin fills
  );

  return baseValues;
}

// ==================== buildWorkbook ====================
export async function buildWorkbook(
  students: StudentRankedDto[],
  segment: string,               
  applicationDateId: string,
  isNew: boolean,
): Promise<Buffer> {
  const workbook = new Workbook();
  const sheet = workbook.addWorksheet('Sheet1', {
    views: [{ rightToLeft: true }],
  });

  // Dynamically build columns from i18n
  const columns = isNew 
    ? [
        i18n.sheet.columns.index,
        i18n.sheet.columns.db_id,
        i18n.sheet.columns.id,
        i18n.sheet.columns.full_name,
        i18n.sheet.columns.student_type,
        i18n.sheet.columns.faculty,
        i18n.sheet.columns.grade,
        i18n.sheet.columns.qualification,
        i18n.sheet.columns.governorate,
        i18n.sheet.columns.city,
        i18n.sheet.columns.village,
        i18n.sheet.columns.school_governorate, 
        i18n.sheet.columns.guardian_id,
        i18n.sheet.columns.guardian_name,
        i18n.sheet.columns.guardian_relation,
        i18n.sheet.columns.guardian_occupation,
        i18n.sheet.columns.security_status,
        i18n.sheet.columns.admin_decision,
        i18n.sheet.columns.message_to_student,
      ]
    : [
        i18n.sheet.columns.index,
        i18n.sheet.columns.db_id,
        i18n.sheet.columns.id, 
        i18n.sheet.columns.full_name,
        i18n.sheet.columns.student_type,
        i18n.sheet.columns.faculty,
        i18n.sheet.columns.level,
        i18n.sheet.columns.last_year_estimate,
        i18n.sheet.columns.governorate,
        i18n.sheet.columns.city,
        i18n.sheet.columns.village,
        i18n.sheet.columns.guardian_id,
        i18n.sheet.columns.guardian_name,
        i18n.sheet.columns.guardian_relation,
        i18n.sheet.columns.guardian_occupation,
        i18n.sheet.columns.security_status,
        i18n.sheet.columns.admin_decision,
        i18n.sheet.columns.message_to_student,
      ];

  // Row 1: Title (merged)
  const titleRow = sheet.addRow([]);
  const titleText = i18n.sheet.title
    .replace('{{segment}}', segment)
    .replace('{{phaseId}}', applicationDateId);
    
  sheet.mergeCells(`A1:${String.fromCharCode(64 + columns.length)}1`);
  const titleCell = titleRow.getCell(1);
  titleCell.value = titleText;
  titleCell.font = { bold: true, size: 14 }; 
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  titleCell.border = BORDER_STYLE;

  // Row 2: Headers
  const headerRow = sheet.addRow(columns);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = BORDER_STYLE;
  });

  // ==================== Pre-Process & Sort ====================
  // Force 'rejected' for returning students with grade '0'
  const processedStudents = students.map((student) => {
    const cloned = { ...student };
    if (!isNew && String(cloned.grade) === '0') {
      cloned._systemRecommendation = 'rejected';
      const failReason = i18n.flags.failed_subjects; 
      if (!cloned._flagReasons) cloned._flagReasons = [];
      if (Array.isArray(cloned._flagReasons) && !cloned._flagReasons.includes(failReason)) {
        cloned._flagReasons = [...cloned._flagReasons, failReason];
      }
    }
    return cloned;
  });

  // FIX: Using actual English database values for sorting instead of i18n translations
  const recOrder: Record<string, number> = { 
    'accepted': 1, 
    'review': 2, 
    'rejected': 3 
  };
  
  processedStudents.sort((a, b) => {
    const orderA = recOrder[a._systemRecommendation?.toLowerCase() || ''] || 4;
    const orderB = recOrder[b._systemRecommendation?.toLowerCase() || ''] || 4;
    return orderA - orderB;
  });

  // ==================== Column Index Helpers ====================
  // Same for both new and returning
  const securityStatusColIndex = columns.indexOf(i18n.sheet.columns.security_status) + 1;
  const adminDecisionColIndex = columns.indexOf(i18n.sheet.columns.admin_decision) + 1;
  const messageColIndex = columns.indexOf(i18n.sheet.columns.message_to_student) + 1;

  // Data Rows (starting row 3)
  processedStudents.forEach((student, idx) => {
    const rowValues = mapStudentToRow(student, idx, isNew);
    const row = sheet.addRow(rowValues);

    row.eachCell((cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = BORDER_STYLE;
    });

    // Data Validation Dropdowns
    row.getCell(securityStatusColIndex).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [STATUS_DROPDOWN],
      showErrorMessage: true,
      errorTitle: 'قيمة غير صالحة',
      error: `يرجى الاختيار من القائمة: ${(i18n.sheet as any).statuses.accepted}, ${(i18n.sheet as any).statuses.rejected}, ${(i18n.sheet as any).statuses.pending}`,
      showInputMessage: true,
      promptTitle: i18n.sheet.columns.security_status,
      prompt: 'اختر حالة الاستعلام الامني',
    };

    row.getCell(adminDecisionColIndex).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [STATUS_DROPDOWN],
      showErrorMessage: true,
      errorTitle: 'قيمة غير صالحة',
      error: `يرجى الاختيار من القائمة: ${(i18n.sheet as any).statuses.accepted}, ${(i18n.sheet as any).statuses.rejected}, ${(i18n.sheet as any).statuses.pending}`,
      showInputMessage: true,
      promptTitle: i18n.sheet.columns.admin_decision,
      prompt: 'اختر قرار الإدارة',
    };

    row.getCell(messageColIndex).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [(i18n.sheet as any).message_to_student_validation],
      showErrorMessage: false,
      showInputMessage: true,
      promptTitle: i18n.sheet.columns.message_to_student,
      prompt: 'Select from the list or type a custom message',
    };
  });

  const lastDataRowNumber = sheet.rowCount;

  // Summary Rows
  const summaryRow1 = sheet.addRow([]);
  const summaryRow2 = sheet.addRow([]);

  // COUNTA on the DB ID column (Column B)
  const idColumnLetter = 'B';
  const countFormula = `COUNTA(${idColumnLetter}3:${idColumnLetter}${lastDataRowNumber})`;
  summaryRow1.getCell(1).value = i18n.sheet.total_students;
  summaryRow1.getCell(2).value = { formula: countFormula };

  if (isNew) {
    const acceptedCount = processedStudents.filter(
      (s) => s._systemRecommendation?.toLowerCase() === 'accepted',
    ).length;
    summaryRow2.getCell(1).value = i18n.sheet.auto_accepted;
    summaryRow2.getCell(2).value = acceptedCount;
  }

  const rowsToStyle = isNew ? [summaryRow1, summaryRow2] : [summaryRow1];
  rowsToStyle.forEach((row) => {
    row.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = BORDER_STYLE;
    });
  });

  // Set column widths dynamically
  sheet.columns.forEach((col, i) => {
    const header = columns[i];
    if (header?.includes(i18n.sheet.columns.full_name) || header?.includes(i18n.sheet.columns.faculty)) {
      col.width = 30;
    } else if (header?.includes('رقم') || header?.includes('ID')) {
      col.width = 20;
    } else {
      col.width = 18;
    }
  });

  // FIX: Provide a strong password so the sheet cannot be accidentally unprotected
  await sheet.protect(process.env.EXCEL_PROTECT_PASSWORD || 'udorm_admin_secure_2026', {
    selectLockedCells: true,
    selectUnlockedCells: true,
  });

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber <= 2) {
      row.eachCell((cell) => { cell.protection = { locked: true }; });
    } else if (row.getCell(1).value !== i18n.sheet.total_students && row.getCell(1).value !== i18n.sheet.auto_accepted) {
      row.eachCell((cell) => { cell.protection = { locked: false }; });
      
      // STRICTLY lock 'م' (Col 1) and 'رقم الطالب' (Col 2)
      row.getCell(1).protection = { locked: true }; 
      row.getCell(2).protection = { locked: true }; 
    } else {
      // Lock the summary rows at the bottom
      row.eachCell((cell) => { cell.protection = { locked: true }; });
    }
  });

  return (await workbook.xlsx.writeBuffer()) as unknown as Buffer;
}

// ==================== parseImportedSheet ====================
export async function parseImportedSheet(
  buffer: Buffer,
): Promise<{ studentId: string; securityStatus: string; adminDecision: string; message: string }[]> {
  const workbook = new Workbook();
  await workbook.xlsx.load(buffer as unknown as ArrayBuffer);

  const sheet = workbook.worksheets[0];
  const result: { studentId: string; securityStatus: string; adminDecision: string; message: string }[] = [];

  let dbIdCol = -1;
  let securityStatusCol = -1;
  let adminDecisionCol = -1;
  let messageCol = -1;

  // Helper to safely extract text from either a string or an ExcelJS RichText object
  const getCellText = (cellValue: any): string => {
    if (!cellValue) return '';
    if (typeof cellValue === 'object' && cellValue.richText) {
      return cellValue.richText.map((rt: any) => rt.text).join('').trim();
    }
    return cellValue.toString().trim();
  };

  sheet.getRow(2).eachCell((cell, colNumber) => {
    // Safely extract and clean the header text
    const header = getCellText(cell.value);
    if (header === i18n.sheet.columns.db_id) dbIdCol = colNumber;
    if (header === i18n.sheet.columns.security_status) securityStatusCol = colNumber;
    if (header === i18n.sheet.columns.admin_decision) adminDecisionCol = colNumber;
    if (header === i18n.sheet.columns.message_to_student) messageCol = colNumber;
  });

  // Strict Validation: Ensure required structural columns exist
  if (dbIdCol === -1 || securityStatusCol === -1 || adminDecisionCol === -1 || messageCol === -1) {
    throw new Error('MISSING_COLUMNS');
  }

  for (let rowNumber = 3; rowNumber <= sheet.rowCount; rowNumber++) {
    const row = sheet.getRow(rowNumber);
    
    // Safely extract the first cell to check for the summary row
    const firstCellValue = getCellText(row.getCell(1).value);
    if (firstCellValue === i18n.sheet.total_students) break; 

    // Safely extract the data cells
    const studentId = getCellText(row.getCell(dbIdCol).value);
    const securityStatus = getCellText(row.getCell(securityStatusCol).value);
    const adminDecision = getCellText(row.getCell(adminDecisionCol).value);
    const message = getCellText(row.getCell(messageCol).value);

    if (studentId) {
      result.push({ studentId, securityStatus, adminDecision, message });
    }
  }

  return result;
}