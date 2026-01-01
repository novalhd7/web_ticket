/**
 * Kontrak TypeScript untuk Midtrans CoreApi → transaction
 *
 * NOTE:
 * - SDK `midtrans-client` belum mendefinisikan `transaction` dengan lengkap
 * - File ini menjadi single source of truth
 * - TANPA `any`
 */

export type MidtransTransactionStatus =
  | "authorize"
  | "capture"
  | "settlement"
  | "pending"
  | "deny"
  | "cancel"
  | "expire"
  | "refund"
  | "partial_refund"
  | "chargeback"
  | "partial_chargeback";

/**
 * Response umum status transaksi Midtrans
 * (subset field yang paling sering dipakai)
 */
export interface MidtransTransactionStatusResponse {
  transaction_id: string;
  order_id: string;
  transaction_status: MidtransTransactionStatus;
  payment_type: string;
  gross_amount: string;
  fraud_status?: string;
  transaction_time: string;
}

/**
 * Request refund (optional, future proof)
 */
export interface MidtransRefundRequest {
  refund_key?: string;
  amount?: number;
  reason?: string;
}

/**
 * API transaction pada CoreApi
 */
export interface MidtransTransactionApi {
  /**
   * Cancel transaksi
   * Digunakan saat booking dibatalkan sebelum settlement
   */
  cancel(orderId: string): Promise<MidtransTransactionStatusResponse>;

  /**
   * Cek status transaksi
   */
  status(orderId: string): Promise<MidtransTransactionStatusResponse>;

  /**
   * Refund transaksi
   * (Optional – belum dipakai sekarang)
   */
  refund?(
    orderId: string,
    payload?: MidtransRefundRequest
  ): Promise<MidtransTransactionStatusResponse>;
}
