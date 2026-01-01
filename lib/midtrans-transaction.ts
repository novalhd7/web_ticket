import { coreApi } from "@/lib/midtrans";
import type { MidtransTransactionApi } from "@/lib/midtrans-transaction.types";

/**
 * Wrapper type-safe untuk CoreApi.transaction
 */
export function getMidtransTransaction(): MidtransTransactionApi {
  return (
    coreApi as unknown as {
      transaction: MidtransTransactionApi;
    }
  ).transaction;
}
