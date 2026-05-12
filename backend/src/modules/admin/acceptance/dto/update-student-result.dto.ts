import { IsIn, IsString, IsOptional, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

const ResultStatuses = ['accepted', 'rejected', 'pending'] as const;

@ValidatorConstraint({ name: 'SequentialAcceptanceRule', async: false })
export class SequentialAcceptanceRule implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const obj = args.object as UpdateStudentResultDto;
    const field = args.property;

    if (field === 'candidate_for_final_acceptance') {
      if (obj.security_result_inquiry !== 'accepted' && value !== 'pending') {
        return false;
      }
    }

    if (field === 'final_acceptance') {
      if (obj.candidate_for_final_acceptance !== 'accepted' && value !== 'pending') {
        return false;
      }
      if (obj.security_result_inquiry !== 'accepted' && value !== 'pending') {
        return false;
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    if (args.property === 'candidate_for_final_acceptance') {
      return 'Candidate and final acceptance must be pending if security is not accepted.';
    }
    if (args.property === 'final_acceptance') {
      return 'Final acceptance must be pending if candidate is not accepted.';
    }
    return 'Sequential validation failed.';
  }
}

export class UpdateStudentResultDto {
  @IsIn(ResultStatuses, { message: 'Must be accepted, rejected, or pending' })
  security_result_inquiry: string;

  @IsIn(ResultStatuses, { message: 'Must be accepted, rejected, or pending' })
  @Validate(SequentialAcceptanceRule)
  candidate_for_final_acceptance: string;

  @IsIn(ResultStatuses, { message: 'Must be accepted, rejected, or pending' })
  @Validate(SequentialAcceptanceRule)
  final_acceptance: string;

  @IsString()
  @IsOptional()
  message_to_student?: string;
}