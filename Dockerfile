FROM golang:1.23


EXPOSE 4000


WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -v -o /oplus ./cmd/api/

CMD ["/oplus"]
