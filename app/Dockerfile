FROM node:20-slim

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
RUN pnpm install --frozen-lockfile

COPY . .

CMD ["pnpm", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
