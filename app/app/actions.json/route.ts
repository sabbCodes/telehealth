// import { ACTIONS_CORS_HEADERS, type ActionsJson } from "@solana/actions";

// export const GET = async () => {
//   const payload: ActionsJson = {
//     rules: [
//       // map all root level routes to an action
//       {
//         pathPattern: "/connected",
//         apiPath: "/api/action",
//       },
//       // idempotent rule as the fallback
//       {
//         pathPattern: "/api/action",
//         apiPath: "/api/action",
//       },
//     ],
//   };

//   return Response.json(payload, {
//     headers: ACTIONS_CORS_HEADERS,
//   });
// };

// // DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// // THIS WILL ENSURE CORS WORKS FOR BLINKS
// export const OPTIONS = GET;



import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";

export const GET = async () => {
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "/connected",
        apiPath: "/api/action",
      },
    ],
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = GET;