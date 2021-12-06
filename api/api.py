import time
from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS
from scipy.io import wavfile


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


@app.route('/api/audio', methods = ['POST'])
def get_audio_from_react():
    req = request.files['file']
    print(type(req))
    req.save(req.filename)
    samplerate, data = wavfile.read(req.filename)
    print(data[:5])
    return "success"


def update_osc_packet(uuid, funda, harmon, curves, multiple, feedback):

    if uuid not in uuid_to_index:
        uuid_to_index[uuid] = len(uuid_to_index.keys())

    index_to_update = uuid_to_index[uuid]

    data_bundle['fundamentals'][index_to_update] = funda
    data_bundle['harmonicities'][index_to_update] = harmon
    data_bundle['amp_curves'][index_to_update] = curves
    data_bundle['delay_multiples'][index_to_update] = multiple
    data_bundle['delay_feebacks'][index_to_update] = feedback

    msg1 = oscbuildparse.OSCMessage("/fundamental", None, data_bundle['fundamentals'])
    msg2 = oscbuildparse.OSCMessage("/harmonicity", None, data_bundle['harmonicities'])
    msg3 = oscbuildparse.OSCMessage("/amp_curve", None, data_bundle['amp_curves'])
    msg4 = oscbuildparse.OSCMessage("/delay/multiple", None, data_bundle['delay_multiples'])
    msg5 = oscbuildparse.OSCMessage("/delay/feedback", None, data_bundle['delay_feebacks'])
    bun = oscbuildparse.OSCBundle(oscbuildparse.OSC_IMMEDIATELY,
                        [msg1, msg2, msg3, msg4, msg5])
    osc_send(bun, "local")
    osc_process()
