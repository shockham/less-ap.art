FROM hayd/deno:1.6.3

EXPOSE 8080
WORKDIR /app

RUN deno install -A -f -n aleph https://deno.land/x/aleph@v0.2.28/cli.ts

COPY . .

CMD sh -c "aleph start -hn 0.0.0.0 -p 8080"
