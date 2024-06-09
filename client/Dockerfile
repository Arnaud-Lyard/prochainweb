FROM node:20.9.0-alpine3.17

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY src ./src
COPY public ./public
COPY tsconfig.json ./tsconfig.json
COPY next-env.d.ts ./next-env.d.ts
COPY *.config.js ./
COPY *.config.mjs ./
COPY tailwind.config.ts ./tailwind.config.ts

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL ${NEXT_PUBLIC_GRAPHQL_API_URL}

ARG NEXT_PUBLIC_UPLOAD_API_ENDPOINT
ENV NEXT_PUBLIC_UPLOAD_API_ENDPOINT ${NEXT_PUBLIC_UPLOAD_API_ENDPOINT}

CMD npm run dev