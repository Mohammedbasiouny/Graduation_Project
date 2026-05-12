import { Injectable } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { PrismaService } from "src/prisma/prisma.service";
import { ValidationErrorHelper } from "../helpers/validation-error.helper";

// validators/address.validator.ts
@Injectable()
export class AddressValidator {
    constructor(
        private readonly prisma: PrismaService,
        private readonly i18n: I18nService,
    ) { }

    async assertValidAddress(
        governorateId: number,
        policeDepartmentId: number,
        cityId: number,
    ): Promise<void> {
        const [gov, police, city] = await Promise.all([
            this.prisma.governorate.findUnique({
                where: { id: governorateId },
                select: { id: true },
            }),
            this.prisma.policeDepartment.findUnique({
                where: { id: policeDepartmentId },
                select: { id: true, governorate_id: true },
            }),
            this.prisma.citySheikhVillage.findUnique({
                where: { id: cityId },
                select: { id: true, governorate_id: true, police_department_id: true },
            }),
        ]);

        // Step 1 — check each one exists
        this.assertAllExist(gov, police, city);

        // Step 2 — check they belong to each other
        this.assertRelationships(gov, police, city);
    }

    private assertAllExist(gov: any, police: any, city: any): void {
        if (!gov || !police || !city) {
            ValidationErrorHelper.throw({
                governorate: [this.i18n.translate('student.INVALID_GOVERNORATE_DATA')],
                district_or_center: [this.i18n.translate('student.INVALID_POLICE_DEPARTMENT_DATA')],
                city_or_village: [this.i18n.translate('student.INVALID_CITY_OR_VILLAGE_DATA')],
            });
        }
    }

    private assertRelationships(gov: any, police: any, city: any): void {
        const govMatchesPolice = gov.id === police.governorate_id;
        const govMatchesCity = gov.id === city.governorate_id;
        const policeMatchesCity = city.police_department_id === police.id;

        if (!govMatchesPolice || !govMatchesCity || !policeMatchesCity) {
            ValidationErrorHelper.throw({
                governorate: [this.i18n.translate('student.INVALID_GOVERNORATE_DATA')],
                district_or_center: [this.i18n.translate('student.INVALID_POLICE_DEPARTMENT_DATA')],
                city_or_village: [this.i18n.translate('student.INVALID_CITY_OR_VILLAGE_DATA')],
            });
        }
    }
}