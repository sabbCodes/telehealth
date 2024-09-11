import { createActionHeaders, type ActionsJson } from "@solana/actions";

export const GET = async () => {
  const payload: ActionsJson = {
    rules: [
      // map all root level routes to an action
      {
        // pathPattern: "/**",
        // apiPath: "/api/action",
        pathPattern: "/api/action",
        apiPath: "/api/action",
      },
      // idempotent rule as the fallback
      // {
      //   pathPattern: "/api/action",
      //   apiPath: "/api/action",
      // },
    ],
  };

  return Response.json(payload, {
    headers: createActionHeaders(),
  });
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = GET;