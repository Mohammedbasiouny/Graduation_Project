import { Module } from '@nestjs/common';
import { GovernoratesModule } from './governorates/governorates.module';
import { PoliceDepartmentsModule } from './police-departments/police-departments.module';
import { EducationalDepartmentsModule } from './educational-departments/educational-departments.module';
import { CitiesModule } from './cities/cities.module';

@Module({
  imports: [
    GovernoratesModule,
    PoliceDepartmentsModule,
    EducationalDepartmentsModule,
    CitiesModule,
  ],
})
export class LocationsModule {}
