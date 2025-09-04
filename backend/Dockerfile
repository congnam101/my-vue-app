FROM node:22-alpine

WORKDIR /app

# Cài dependencies
COPY package*.json ./
RUN npm install

# Copy prisma schema trước
COPY prisma ./prisma

# Copy toàn bộ source code
COPY . .

# ✅ Generate prisma client sau khi copy toàn bộ
RUN npx prisma generate

# Build Typescript
RUN npm run build

CMD ["node", "dist/index.js"]
