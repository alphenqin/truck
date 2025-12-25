package utils

import "log"

type Logger struct{}

var Log = &Logger{}

func (l *Logger) Info(args ...any) {
	log.Println(append([]any{"INFO"}, args...)...)
}

func (l *Logger) Warn(args ...any) {
	log.Println(append([]any{"WARN"}, args...)...)
}

func (l *Logger) Error(args ...any) {
	log.Println(append([]any{"ERROR"}, args...)...)
}

func (l *Logger) Panic(args ...any) {
	log.Panicln(append([]any{"PANIC"}, args...)...)
}
