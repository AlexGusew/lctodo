import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ["src/generated/"],
  },
];

export default eslintConfig;
