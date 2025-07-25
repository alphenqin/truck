FROM node:18-alpine AS builder
WORKDIR /app
COPY ./web /app
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./web/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]