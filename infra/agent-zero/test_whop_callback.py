import os, time, unittest
os.environ.setdefault("PENDING_FILE", "/tmp/unused-test-pending")
from whop_callback import valid_callback
class CallbackSecurity(unittest.TestCase):
    def setUp(self):
        self.pending={"state":"x"*32,"expires":1000}
        self.query={"state":["x"*32],"code":["test"]}
    def check(self,q=None,p=None,path="/oauth/callback",now=500):
        return valid_callback(path,self.query if q is None else q,self.pending if p is None else p,now)
    def test_matching_state(self): self.assertTrue(self.check())
    def test_wrong_state(self): self.assertFalse(self.check({"state":["wrong"],"code":["test"]}))
    def test_unicode_state(self): self.assertFalse(self.check({"state":["🌴"],"code":["test"]}))
    def test_expired(self): self.assertFalse(self.check(now=1001))
    def test_replay(self): self.assertFalse(self.check(p={**self.pending,"used":True}))
    def test_duplicate(self): self.assertFalse(self.check(q={**self.query,"state":["x"*32,"x"*32]}))
    def test_missing_code(self): self.assertFalse(self.check(q={"state":["x"*32]}))
    def test_wrong_issuer(self): self.assertFalse(self.check(q={**self.query,"iss":["https://attacker.example"]}))
    def test_other_path(self): self.assertFalse(self.check(path="/wait-for-auth"))
    def test_extra_field(self): self.assertFalse(self.check(q={**self.query,"extra":["value"]}))
if __name__ == "__main__": unittest.main()
