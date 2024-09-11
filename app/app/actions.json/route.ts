// import { createActionHeaders, type ActionsJson } from "@solana/actions";

// export const GET = async () => {
//   const payload: ActionsJson = {
//     rules: [
//       // map all root level routes to an action
//       {
//         pathPattern: "/**",
//         apiPath: "/api/action",
//       },
//       // idempotent rule as the fallback
//     //   {
//     //     pathPattern: "/api/action",
//     //     apiPath: "/api/action",
//     //   },
//     ],
//   };

//   return Response.json(payload, {
//     headers: createActionHeaders(),
//   });
// };

// // DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// // THIS WILL ENSURE CORS WORKS FOR BLINKS
// export const OPTIONS = GET;




import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";

export const GET = async () => {
  const payload: ActionsJson = {
    rules: [
      // map all root level routes to an action
      {
        pathPattern: "/**",
        apiPath: "/api/action",
      },
      // {
      //   pathPattern: "/",
      //   apiPath: "/api/action",
      // },
    ],
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = GET;