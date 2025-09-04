# ở root
docker compose up -d --build

# xem logs
docker compose logs -f backend
docker compose logs -f frontend

# vào backend container (nếu cần)
docker compose exec backend sh

# chạy prisma migrate/generate (từ trong container)
npx prisma migrate deploy
npx prisma generate
# tắt
docker compose down -v

docker compose ps
