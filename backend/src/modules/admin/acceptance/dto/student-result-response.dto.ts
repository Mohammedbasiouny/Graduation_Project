export class StudentResultResponseDto {
  securityResultInquiry: string;
  candidateForFinalAcceptance: string;
  finalAcceptance: string;
  messageToStudent: string;
  
  // Computed field representing the UI state the student actually sees
  studentVisibleStatus: string; 

  constructor(partial: Partial<StudentResultResponseDto>) {
    Object.assign(this, partial);
  }
}