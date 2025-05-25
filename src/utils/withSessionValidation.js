"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { validateSessionWithCookie } from "@/utils/auth";  // Create a function to validate using cookies

const withSessionValidation = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const interval = setInterval(async () => {
        const isValidSession = await validateSessionWithCookie(); // Check session using the HTTP-only cookie

        if (!isValidSession) {
          router.push("/login"); // Redirect to login if session is invalid
        }
      }, 5 * 60 * 1000); // Validate session every 5 minutes

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withSessionValidation;