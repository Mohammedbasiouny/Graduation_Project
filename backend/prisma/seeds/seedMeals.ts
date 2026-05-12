import { PrismaClient, MealCategory } from '@prisma/client';

export default async function seedMeals(prisma: PrismaClient) {
  const meals = [
    // Breakfast
    {
      name: 'Standard Breakfast',
      category: MealCategory.breakfast,
      description: 'Bread, cheese, eggs, and tea',
    },
    {
      name: 'Light Breakfast',
      category: MealCategory.breakfast,
      description: 'Yogurt, fruit, and juice',
    },

    // Lunch
    {
      name: 'Chicken Lunch',
      category: MealCategory.lunch,
      description: 'Rice, grilled chicken, salad',
    },
    {
      name: 'Beef Lunch',
      category: MealCategory.lunch,
      description: 'Rice, beef, vegetables',
    },
    {
      name: 'Vegetarian Lunch',
      category: MealCategory.lunch,
      description: 'Vegetables, rice, legumes',
    },

    // Dinner
    {
      name: 'Light Dinner',
      category: MealCategory.dinner,
      description: 'Cheese, yogurt, bread',
    },
    {
      name: 'Protein Dinner',
      category: MealCategory.dinner,
      description: 'Tuna, eggs, salad',
    },

    // Suhoor
    {
      name: 'Ramadan Suhoor 1',
      category: MealCategory.suhoor,
      description: 'Beans, eggs, bread, yogurt',
    },
    {
      name: 'Ramadan Suhoor 2',
      category: MealCategory.suhoor,
      description: 'Cheese, dates, milk, bread',
    },
  ];

  for (const meal of meals) {
    await prisma.meal.upsert({
      where: { name: meal.name },
      update: {},
      create: meal,
    });
  }

  console.log(`🌱 Seeded ${meals.length} meals`);
}
