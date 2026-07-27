package tcpserver

import (
	"context"
	"testing"
	"time"
)

func TestWaitForRetryStopsOnCancellation(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	start := time.Now()
	if waitForRetry(ctx, time.Minute) {
		t.Fatal("waitForRetry returned true for a cancelled context")
	}
	if time.Since(start) > time.Second {
		t.Fatal("waitForRetry did not stop promptly")
	}
}
