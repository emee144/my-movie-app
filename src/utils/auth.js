export const validateSession = async (router) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${API_URL}/api/auth/validate`, {
      method: "POST",
      credentials: "include", // Send cookies with request
    });

    if (!res.ok) {
      console.error("Session validation failed:", res.status);
      throw new Error("Session expired");
    }

    const data = await res.json();
    console.log("Session validated:", data);
  } catch (error) {
    console.error("Error validating session:", error);
    router.push("/login");
  }
};