import "next-auth";
import "next-auth/jwt";

export type UserType = "company" | "investor" | "expert";

declare module "next-auth" {
  interface User {
    id: string;
    jwt: string;
    user_type: UserType;
    display_name: string;
  }

  interface Session {
    jwt: string;
    user: {
      id: string;
      email: string;
      user_type: UserType;
      display_name: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    jwt: string;
    user_type: UserType;
    display_name: string;
  }
}
