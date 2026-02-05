FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN node node_modules/vite/bin/vite.js build

FROM nginx:alpine

# 기본 설정 제거
RUN rm /etc/nginx/conf.d/default.conf

# 새 설정 추가
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]