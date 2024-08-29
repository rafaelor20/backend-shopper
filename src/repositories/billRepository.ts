import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const billRepository = {
  async findExistingReading(customer_code: string, measure_datetime: Date, measure_type: string) {
    const startOfMonth = new Date(measure_datetime.getFullYear(), measure_datetime.getMonth(), 1);
    const endOfMonth = new Date(measure_datetime.getFullYear(), measure_datetime.getMonth() + 1, 0);

    return prisma.reading.findFirst({
      where: {
        customer_code,
        measure_type,
        measure_datetime: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });
  },

  async saveBill(data: { customer_code: string, measure_datetime: Date, measure_type: string, measure_value: number, image_url: string, measure_uuid: string }) {
    return prisma.reading.create({
      data,
    });
  },
};
