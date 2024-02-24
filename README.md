# WASM-based Tengo Playground

This proof of concept demonstrates how to run the [Tengo programming language](https://github.com/d5/tengo) in the browser using WebAssembly.

Explore the Tengo playground deployed as a static website here: https://tengo.mkuznets.com

## Quick Start

1. Install [Go](https://golang.org/dl/).
2. Run `make build` to compile `static/tengo.wasm`
3. Serve the `./static` directory using any HTTP file server. For example:
   ```bash
   python -m http.server -d ./static --bind 127.0.0.1 8000
   ```
