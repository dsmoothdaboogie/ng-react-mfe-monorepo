FROM node:20-alpine AS build
WORKDIR /repo
COPY . .
RUN corepack enable && npm i -g pnpm@9.12.3
RUN pnpm i
RUN pnpm --filter @acme/mfe-customers... build

FROM nginx:alpine
COPY apps/mfe-customers/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/mfe-customers/dist /usr/share/nginx/html
EXPOSE 8080
