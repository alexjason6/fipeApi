FROM node:22

ENV NODE_ENV=production
ENV PORT=3002

# cria usuário não-root
RUN useradd -m nodeuser

WORKDIR /app

# só copia dependências primeiro
COPY package*.json yarn.lock* ./
RUN corepack enable \
    && (yarn install --production --frozen-lockfile || yarn install --production)

# copia o resto da aplicação
COPY . .

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://localhost:3002/health || curl -fsS http://localhost:3002/ || exit 1

CMD ["yarn", "start"]
