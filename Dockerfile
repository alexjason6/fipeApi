# ---------- builder ----------
    FROM node:20-slim AS builder
    ENV DEBIAN_FRONTEND=noninteractive
    WORKDIR /app
  
    RUN apt-get update -y && apt-get install -y --no-install-recommends \
        git ca-certificates python3 make g++ \
     && rm -rf /var/lib/apt/lists/*
  
    # Instala deps com Yarn (v1 ou Berry)
    COPY package.json yarn.lock* ./
    RUN corepack enable \
     && (yarn install --immutable || yarn install --frozen-lockfile || yarn install)
  
    # Copia o restante do projeto
    COPY . .
  
    # Se não houver script "build", isso não quebra
    RUN yarn run build || echo "Sem script de build; seguindo."
  
    # Somente deps de produção
    RUN rm -rf node_modules \
     && (yarn workspaces focus --all --production 2>/dev/null || yarn install --production --frozen-lockfile || yarn install --production)
  
    # ---------- runner ----------
    FROM node:20-slim AS runner
    ENV NODE_ENV=production
    ENV PORT=3002
    WORKDIR /app
  
    # Libs para Puppeteer/Chromium no Debian 12 (sem libatk1.0-data)
    RUN apt-get update -y && apt-get install -y --no-install-recommends \
        ca-certificates curl wget dumb-init \
        fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libcups2 \
        libatspi2.0-0 libdbus-1-3 libdrm2 libegl1 libgbm1 \
        libglib2.0-0 libgtk-3-0 libnss3 libx11-6 libx11-xcb1 libxcb1 \
        libxcomposite1 libxdamage1 libxext6 libxfixes3 libxrandr2 \
        libxrender1 libxshmfence1 libxss1 libxtst6 xdg-utils \
     && rm -rf /var/lib/apt/lists/*
  
    #RUN mkdir -p dist build public prisma
    #
  
    # Copia somente o necessário do builder
    COPY --from=builder /app ./
    COPY . .
    #COPY --from=builder /app/.env.production ./.env.production
  
    EXPOSE 3002
  
    # Healthcheck simples
    HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
      CMD curl -fsS http://localhost:3002/health || curl -fsS http://localhost:3002/ || exit 1
  
    ENTRYPOINT ["dumb-init", "--"]
    CMD ["yarn", "start"]
  