export const RELATION_MAP: Record<string, { relation: string; field: string; header: string }> = {
    facultyId: { relation: 'faculty', field: 'name', header: 'Faculty' },
    departmentId: { relation: 'department', field: 'name', header: 'Department' },
    governorateId: { relation: 'governorate', field: 'name', header: 'Governorate' },
    cityId: { relation: 'city', field: 'name', header: 'City' },
    policeDepartmentId: { relation: 'policeDepartment', field: 'name', header: 'Police Department' },
    qualificationId: { relation: 'qualification', field: 'name', header: 'Qualification' },
    highSchoolGovernorate: { relation: 'highSchoolGovernorateRel', field: 'name', header: 'High School Governorate' },
    highSchoolEducationDistrictId: { relation: 'educationalDepartment', field: 'name', header: 'Educational Department' },
};