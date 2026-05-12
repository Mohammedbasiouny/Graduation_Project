import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  UnprocessableEntityException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { I18nService } from 'nestjs-i18n';
import { CreateMealDto, UpdateMealDto } from './dto/index';

@Injectable()
export class MealsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) { }

  private formatResponse(meal: any) {
    return {
      id: meal.id,
      name: meal.name,
      category: meal.category,
      is_active: meal.is_active,
      description: meal.description,
    };
  }

  // =============================================================
  // Create Meal
  // =============================================================
  async create(createDto: CreateMealDto, lang: string) {
    try {
      const sanitizedName = createDto.name.trim();

      const existingMeal = await this.prisma.meal.findFirst({
        where: {
          name: { equals: sanitizedName, mode: 'insensitive' },
        },
      });

      if (existingMeal) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            name: [this.i18n.translate('restaurant.meals.NAME_ALREADY_EXISTS', { lang })],
          },
        });
      }

      const meal = await this.prisma.meal.create({
        data: {
          name: sanitizedName,
          category: createDto.category,
          is_active: createDto.is_active ?? true,
          description: createDto.description?.trim() || null,
        },
      });

      return this.formatResponse(meal);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('restaurant.meals.CREATE_FAILED');
    }
  }

  // =============================================================
  // Get All Meals
  // =============================================================
  async findAll(page: number = 1, pageSize: number = 20, withPagination: boolean = true) {
    try {
      // ================= WITHOUT PAGINATION =================
      if (!withPagination) {
        const items = await this.prisma.meal.findMany({
          orderBy: { created_at: 'asc' },
        });

        return {
          data: items.map((m) => this.formatResponse(m)),
          meta: {
            pagination: {
              page: 1,
              page_size: items.length,
              total_pages: 1,
              total_items: items.length,
            },
            search: null,
            filters: null,
            sorting: null,
          },
        };
      }

      // ================= WITH PAGINATION =================
      const skip = (page - 1) * pageSize;

      const [items, totalItems] = await this.prisma.$transaction([
        this.prisma.meal.findMany({
          skip,
          take: pageSize,
          orderBy: { created_at: 'asc' },
        }),
        this.prisma.meal.count(),
      ]);

      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        data: items.map((m) => this.formatResponse(m)),
        meta: {
          pagination: {
            page,
            page_size: pageSize,
            total_pages: totalPages,
            total_items: totalItems,
          },
          search: null,
          filters: null,
          sorting: null,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('restaurant.meals.FETCH_FAILED');
    }
  }

  // =============================================================
  // Get Meal by ID
  // =============================================================
  async findOne(id: number) {
    try {
      const meal = await this.prisma.meal.findUnique({ where: { id } });
      if (!meal) throw new NotFoundException('restaurant.meals.NOT_FOUND');
      return this.formatResponse(meal);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('restaurant.meals.FETCH_FAILED');
    }
  }

  // =============================================================
  // Update Meal
  // =============================================================
  async update(id: number, updateDto: UpdateMealDto, lang: string) {
    try {
      const existingMeal = await this.prisma.meal.findUnique({ where: { id } });
      if (!existingMeal) throw new NotFoundException('restaurant.meals.NOT_FOUND');

      if (updateDto.name) {
        const sanitizedName = updateDto.name.trim();
        const duplicate = await this.prisma.meal.findFirst({
          where: {
            name: { equals: sanitizedName, mode: 'insensitive' },
            id: { not: id },
          },
        });

        if (duplicate) {
          throw new UnprocessableEntityException({
            status: 'error',
            message: ['Validation failed.'],
            data: null,
            errors: {
              name: [this.i18n.translate('restaurant.meals.NAME_ALREADY_EXISTS', { lang })],
            },
          });
        }

        updateDto.name = sanitizedName;
      }

      // ── Active Schedule Restriction ──
      // Block deactivation if meal is linked to an active schedule
      if (updateDto.is_active === false && existingMeal.is_active === true) {
        const activeSlot = await this.prisma.mealSlot.findFirst({
          where: {
            meal_id: id,
            delivery_end_time: { gt: new Date() },
          },
        });

        if (activeSlot) {
            throw new UnprocessableEntityException({
              status: 'error',
              message: ['Validation failed.'],
              data: null,
              errors: {
                is_active: [this.i18n.translate('restaurant.meals.DEACTIVATE_LINKED_SCHEDULES', { lang })],
              },
            });
          }
        }

        const updateData: any = {};

        if (updateDto.name !== undefined) updateData.name = updateDto.name;
        if (updateDto.category !== undefined) updateData.category = updateDto.category;
        if (updateDto.is_active !== undefined) updateData.is_active = updateDto.is_active;
        if (updateDto.description !== undefined) updateData.description = updateDto.description?.trim() || null;

        const updatedMeal = await this.prisma.meal.update({
          where: { id },
          data: updateData,
        });

        return this.formatResponse(updatedMeal);
      } catch (error) {
        if (error instanceof HttpException) throw error;
        throw new InternalServerErrorException('restaurant.meals.UPDATE_FAILED');
      }
    }

  // =============================================================
  // Delete (Deactivate) Meal
  // =============================================================
  async remove(id: number) {
      try {
        const meal = await this.prisma.meal.findUnique({
          where: { id },
          include: { slots: true },
        });

        if (!meal) throw new NotFoundException('restaurant.meals.NOT_FOUND');

        if (meal.slots && meal.slots.length > 0) {
          throw new ConflictException("restaurant.meals.HAS_LINKED_SCHEDULES");
        }

        await this.prisma.meal.delete({
          where: { id },
        });
      } catch (error) {
        if (error instanceof HttpException) throw error;
        throw new InternalServerErrorException('restaurant.meals.DELETE_FAILED');
      }
    }
  }