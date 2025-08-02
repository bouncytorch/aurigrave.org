FROM node:24-slim

WORKDIR /app
COPY . .

RUN npm install
RUN npx tsc -b -v

CMD [ "node", "." ]
