FROM golang:1.23 as builder

EXPOSE 4000

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -v -o /oplus ./cmd/api/

FROM alpine:3.20

WORKDIR /app

COPY --from=builder /app/oplus .

CMD ["./oplus"]
