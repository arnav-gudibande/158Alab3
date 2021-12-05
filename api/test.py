from osc4py3.as_eventloop import *
from osc4py3 import oscbuildparse

# Start the system.
osc_startup()

# Make client channels to send packets.
osc_udp_client("127.0.0.1", 5005, "tester")

msg1 = oscbuildparse.OSCMessage("/sound/levels", None, [1, 5, 3])
msg2 = oscbuildparse.OSCMessage("/sound/bits", None, [32])
msg3 = oscbuildparse.OSCMessage("/sound/freq", None, [42000])
bun = oscbuildparse.OSCBundle(oscbuildparse.OSC_IMMEDIATELY,
                    [msg1, msg2, msg3])
osc_send(bun, "tester")
osc_process()
