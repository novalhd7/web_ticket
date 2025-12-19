// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // file yang berisi NextAuth options

const handler = NextAuth(authOptions);

// export tiap HTTP method
export { handler as GET, handler as POST };
