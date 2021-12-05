import time
from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS


from osc4py3.as_eventloop import *
from osc4py3 import oscbuildparse

app = Flask(__name__)
CORS(app)


# Start the system.
osc_startup()
osc_udp_client("127.0.0.1", 5005, "local")


data_bundle = {
    'fundamentals': [2000, 2000, 2000, 2000],
    'harmonicities': [0.5, 0.5, 0.5, 0.5],
    'amp_curves': [5000, 5000, 5000, 5000],
    'delay_multiples': [0.5, 0.5, 0.5, 0.5],
    'delay_feebacks': [0.5, 0.5, 0.5, 0.5]
}
uuid_to_index = {}
counter = 0


@app.route('/api/query', methods = ['POST'])
def get_query_from_react():
    req = request.get_json()
    update_osc_packet(req['uuid'], req['fundamental'], req['harmonicity'],
        req['decay'], req['exp_base'], req['scalar'])
    return req


def update_osc_packet(uuid, funda, harmon, decay, exp_base, scalar):

    if uuid not in uuid_to_index:
        uuid_to_index[uuid] = len(uuid_to_index.keys())

    index_to_update = uuid_to_index[uuid]

    data_bundle['fundamentals'][index_to_update] = funda
    data_bundle['harmonicities'][index_to_update] = harmon
    data_bundle['decays'][index_to_update] = decay
    data_bundle['amp_bases'][index_to_update] = exp_base
    data_bundle['amp_scalars'][index_to_update] = scalar

    msg1 = oscbuildparse.OSCMessage("/fundamental", None, data_bundle['fundamentals'])
    msg2 = oscbuildparse.OSCMessage("/harmonicity", None, data_bundle['harmonicities'])
    msg3 = oscbuildparse.OSCMessage("/amp_curve", None, data_bundle['amp_curves'])
    msg4 = oscbuildparse.OSCMessage("/delay/multiple", None, data_bundle['delay_multiples'])
    msg5 = oscbuildparse.OSCMessage("/delay/feedback", None, data_bundle['delay_feebacks'])
    bun = oscbuildparse.OSCBundle(oscbuildparse.OSC_IMMEDIATELY,
                        [msg1, msg2, msg3, msg4, msg5])
    osc_send(bun, "local")
    osc_process()
