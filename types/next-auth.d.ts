import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isActive: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    isActive: boolean;
  }

  interface JWT {
    id: string;
    role: string;
    isActive: boolean;
  }
}
