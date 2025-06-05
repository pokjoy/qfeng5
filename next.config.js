/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // 新增解锁需要的 env
    JWT_SECRET:       process.env.JWT_SECRET,
    CODE_LIST:        process.env.CODE_LIST,
  },
}

module.exports = nextConfig

