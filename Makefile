.PHONY: build
build:
	 GOARCH=wasm GOOS=js go build -o static/tengo.wasm -trimpath mkuznets.com/go/tengo-wasm

.PHONY: clean
clean:
	rm -f static/tengo.wasm

.PHONY: serve
serve:
	python -m http.server -d ./static --bind 127.0.0.1 8000
