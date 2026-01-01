import midtransClient from "midtrans-client";

if (!process.env.MIDTRANS_SERVER_KEY || !process.env.MIDTRANS_CLIENT_KEY) {
  throw new Error("Midtrans keys are missing");
}

const options = {
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
};

export const snap = new midtransClient.Snap(options);
export const coreApi = new midtransClient.CoreApi(options);
