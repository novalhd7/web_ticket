import type { SnapTransactionParameters } from "midtrans-client";

export type SnapTransactionWithCustomer = SnapTransactionParameters & {
  customer_details?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  };
};
