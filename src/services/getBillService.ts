import { billRepository } from "@/repositories";

class CustomError extends Error {
  code: string | undefined;
}

export const getBillService = {
  async getBillsByCustomerCode(customer_code: string) {
    const bills = await billRepository.getBillsByCustomerCode(customer_code);
    return bills;
  }
};