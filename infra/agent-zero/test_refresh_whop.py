"""Exercise the bounded refresh loop without credentials, network or real sleeps."""
import json
from pathlib import Path
import runpy
import unittest
from unittest.mock import Mock, patch
from urllib.error import HTTPError, URLError

SCRIPT = Path(__file__).with_name("refresh_whop.py")


class RefreshStatus(unittest.TestCase):
    def run_refresh(self, *, error=None, used=True, tokens=True, connected=False):
        writes = []
        client = Mock()
        if error is not None:
            client.open.side_effect = error
        else:
            payloads = [{}, {"token": "test-csrf"},
                        {"settings": {"mcp_servers": "test-config"}},
                        {"status": [{"name": "whop", "connected": connected,
                                     "tool_count": 4 if connected else 0}]}]
            client.open.side_effect = [
                Mock(read=Mock(return_value=json.dumps(p).encode()))
                for p in payloads * 2]
        with patch("time.time", side_effect=[0, 0, 5, 1200]), \
             patch("time.sleep"), \
             patch.object(Path, "read_text", return_value=json.dumps({"used": used})), \
             patch.object(Path, "rglob", side_effect=lambda _: iter([Path("test-tokens.json")] if tokens else [])), \
             patch.object(Path, "write_text", side_effect=lambda s: writes.append(json.loads(s))), \
             patch("urllib.request.build_opener", return_value=client), \
             patch.dict("os.environ", {"A0_INITIAL_PASSWORD": "test-only"}):
            runpy.run_path(str(SCRIPT), run_name="__main__")
        return writes, client

    def test_credential_failures_preserve_remediation(self):
        for code in (401, 403):
            with self.subTest(code=code):
                writes, client = self.run_refresh(error=HTTPError("http://localhost/login", code, "Denied", {}, None))
                self.assertEqual(client.open.call_count, 2)
                self.assertEqual(len(writes), 2)
                self.assertEqual(writes[-1], {"whop_connected": False,
                    "action": "Check sign-in and apply MCP settings"})

    def test_connectivity_failures_preserve_remediation(self):
        for error in (URLError("Connection refused"), TimeoutError("Timed out")):
            with self.subTest(error=type(error).__name__):
                writes, client = self.run_refresh(error=error)
                self.assertEqual(client.open.call_count, 2)
                self.assertEqual(len(writes), 2)
                self.assertEqual(writes[-1], {"whop_connected": False,
                    "action": "Check sign-in and apply MCP settings"})

    def test_disconnected_result_survives_deadline(self):
        writes, _ = self.run_refresh()
        self.assertEqual(writes, [{"whop_connected": False, "tool_count": 0}] * 2)

    def test_success_stops_without_expiry(self):
        writes, client = self.run_refresh(connected=True)
        self.assertEqual(client.open.call_count, 4)
        self.assertEqual(writes, [{"whop_connected": True, "tool_count": 4}])

    def test_waiting_for_consent_or_tokens_still_expires(self):
        for used, tokens in ((False, True), (True, False)):
            with self.subTest(used=used, tokens=tokens):
                writes, client = self.run_refresh(used=used, tokens=tokens)
                client.open.assert_not_called()
                self.assertEqual(writes, [{"whop_connected": False,
                    "action": "Browser authorization expired; restart sign-in"}])


if __name__ == "__main__":
    unittest.main()
