/** @type {import('next').NextConfig} */
// import { createCivicAuthPlugin } from "@civic/auth-web3/nextjs";

const nextConfig = {
    reactStrictMode: false
};

export default nextConfig;

// const withCivicAuth = createCivicAuthPlugin({
//     clientId: "b1320895-801e-476b-b258-955fb6d108e5",
// });

// export default withCivicAuth(nextConfig);



// import { authMiddleware } from "@civic/auth-web3/nextjs/middleware";

// export default authMiddleware();

// export const config = {
//   // include the paths you wish to secure here
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - _next directory (Next.js static files)
//      * - favicon.ico, sitemap.xml, robots.txt
//      * - image files
//      */
//     "/((?!_next|favicon.ico|sitemap.xml|robots.txt|.*\\.jpg|.*\\.png|.*\\.svg|.*\\.gif).*)",
//   ],
// };
