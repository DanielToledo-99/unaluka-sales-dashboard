FROM node:22-bookworm-slim
WORKDIR /app
RUN corepack enable
RUN corepack prepare pnpm@12.3.4 --activate
COPY package.json pnpm-workspace.yaml ./
RUN pnpm install --no-frozen-lockfile
COPY . .
RUN pnpm exec prisma generate
EXPOSE 3000
CMD ["pnpm","dev"]