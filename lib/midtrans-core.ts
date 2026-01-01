import { coreApi } from "./midtrans";
import type { MidtransTransactionApi } from "./midtrans-transaction.types";

export function getMidtransTransactionApi(): MidtransTransactionApi {
  return (
    coreApi as unknown as {
      transaction: MidtransTransactionApi;
    }
  ).transaction;
}
