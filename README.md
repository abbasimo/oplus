# development guideline


- postgres run command: sudo docker run --name postgres_oplus -e POSTGRES_USER=oplus -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
- postgres://oplus:password@localhost/oplus?sslmode=disable
- migrate create -seq -ext=.sql -dir=./migrations <migration name>
- migrate -path=./migrations -database=$OPLUS_DB_DSN up  | or
- migrate -path=./migrations -database=postgres://oplus:password@localhost/oplus?sslmode=disable up