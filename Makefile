integration:
	docker compose -f db/compose.yaml up -d
	timeout /t 45
	npm --prefix backend/ run test-int
	docker compose -f db/compose.yaml down

unit:
	npm --prefix backend/ run test-unit

test: 
	make unit
	make integration
