//go:build js && wasm

package main

import (
	"fmt"
	"github.com/d5/tengo/v2"
	"github.com/d5/tengo/v2/stdlib"
	"runtime/debug"
	"syscall/js"
)

func main() {
	js.Global().Set("tengo", make(map[string]any))
	module := js.Global().Get("tengo")
	module.Set("version", version())
	module.Set("run", js.FuncOf(run))

	<-make(chan struct{})
}

func version() string {
	buildInfo, ok := debug.ReadBuildInfo()
	if !ok {
		panic("build info not found")
	}

	for _, dep := range buildInfo.Deps {
		if dep.Path == "github.com/d5/tengo/v2" {
			return dep.Version
		}
	}

	return "<unknown>"
}

func run(_ js.Value, args []js.Value) any {
	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("panic: %v\n%s\n", r, string(debug.Stack()))
		}
	}()

	modules := stdlib.GetModuleMap(stdlib.AllModuleNames()...)

	script := tengo.NewScript([]byte(args[0].String()))
	script.SetImports(modules)

	if _, err := script.Run(); err != nil {
		fmt.Println(err.Error())
	}

	return nil
}
