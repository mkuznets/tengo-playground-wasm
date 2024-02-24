.PHONY: build
build:
	 GOARCH=wasm GOOS=js go build -o static/tengo.wasm -trimpath mkuznets.com/go/tengo-wasm
