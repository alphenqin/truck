package tcpserver

import (
	"testing"
	"time"
)

func TestParseDeviceTimeUsesLocalLocation(t *testing.T) {
	data := []byte{0x26, 0x07, 0x27, 0x14, 0x30, 0x45, 0x01, 0xF4}
	got, err := parseDeviceTime(data)
	if err != nil {
		t.Fatalf("parseDeviceTime returned error: %v", err)
	}
	if got.Location() != time.Local {
		t.Fatalf("location = %v, want time.Local", got.Location())
	}
	if got.Year() != 2026 || got.Month() != time.July || got.Day() != 27 ||
		got.Hour() != 14 || got.Minute() != 30 || got.Second() != 45 || got.Nanosecond() != 500000000 {
		t.Fatalf("unexpected parsed time: %v", got)
	}
}

func TestParseDeviceTimeRejectsInvalidValues(t *testing.T) {
	tests := [][]byte{
		{0x26, 0x13, 0x27, 0x14, 0x30, 0x45, 0x00, 0x00},
		{0x26, 0x02, 0x30, 0x14, 0x30, 0x45, 0x00, 0x00},
		{0x2A, 0x07, 0x27, 0x14, 0x30, 0x45, 0x00, 0x00},
	}
	for _, data := range tests {
		if _, err := parseDeviceTime(data); err == nil {
			t.Fatalf("parseDeviceTime(%x) unexpectedly succeeded", data)
		}
	}
}

func TestParseFrameResynchronizesAfterBadInput(t *testing.T) {
	if ok, consumed := parseFrame([]byte{0, 0, 0, 0, 0xff, 0xff}, "test"); !ok || consumed != 1 {
		t.Fatalf("invalid length: ok=%v consumed=%d, want true/1", ok, consumed)
	}

	badBCC := []byte{0, 0, 0, 0, 1, 0, 0x01, 0x00}
	if ok, consumed := parseFrame(badBCC, "test"); !ok || consumed != 1 {
		t.Fatalf("bad BCC: ok=%v consumed=%d, want true/1", ok, consumed)
	}
}

func TestAcceptTagReportDeduplicatesWithinWindow(t *testing.T) {
	dedupMu.Lock()
	lastTagReport = make(map[string]time.Time)
	dedupMu.Unlock()
	now := time.Now()
	if !acceptTagReport("gateway|tag", now) {
		t.Fatal("first report should be accepted")
	}
	if acceptTagReport("gateway|tag", now.Add(time.Second)) {
		t.Fatal("duplicate report inside window should be rejected")
	}
	if !acceptTagReport("gateway|tag", now.Add(tagDedupWindow)) {
		t.Fatal("report at the end of the window should be accepted")
	}
}
