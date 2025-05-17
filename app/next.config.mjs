/** @type {import('next').NextConfig} */
import { createCivicAuthPlugin } from "@civic/auth-web3/nextjs";

const nextConfig = {
    reactStrictMode: false
};

// export default nextConfig;

const withCivicAuth = createCivicAuthPlugin({
    clientId: "b1320895-801e-476b-b258-955fb6d108e5",
});

export default withCivicAuth(nextConfig);
