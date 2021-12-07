import time
from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS, cross_origin
from scipy.io import wavfile


from osc4py3.as_eventloop import *
from osc4py3 import oscbuildparse

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


# Start the system.
osc_startup()
osc_udp_client("127.0.0.1", 5005, "local")


data_bundle = {
    'fundamentals': [2000, 2000, 2000, 2000],
    'harmonicities': [0.5, 0.5, 0.5, 0.5],
    'amp_curves': [5000, 5000, 5000, 5000],
    'delay_multiples': [0.5, 0.5, 0.5, 0.5],
    'delay_feebacks': [0.5, 0.5, 0.5, 0.5],
    'keyNum': 95,
    'frequency': 0,
}
uuid_to_index = {}
counter = 0


@app.route('/api/control', methods = ['POST'])
@cross_origin()
def get_query_from_react():
    req = request.get_json()
    update_osc_packet(req)
    return req


@app.route('/api/io', methods = ['POST'])
@cross_origin()
def get_io_query_from_react():
    req = request.get_json()
    update_osc_packet(req)
    return req


def update_osc_packet(reqDict):

    if 'uuid' in reqDict:
        uuid = reqDict['uuid']

        if uuid not in uuid_to_index:
            uuid_to_index[uuid] = len(uuid_to_index.keys())

        index_to_update = uuid_to_index[uuid]

    if 'fundamental' in reqDict:
        data_bundle['fundamentals'][index_to_update] = reqDict['fundamental']
    if 'harmonicity' in reqDict:
        data_bundle['harmonicities'][index_to_update] = reqDict['harmonicity']
    if 'amp_curves' in reqDict:
        data_bundle['amp_curves'][index_to_update] = reqDict['amp_curves']
    if 'delay_multiples' in reqDict:
        data_bundle['delay_multiples'][index_to_update] = reqDict['delay_multiples']
    if 'delay_feebacks' in reqDict:
        data_bundle['delay_feebacks'][index_to_update] = reqDict['delay_feebacks']
    if 'keyNum' in reqDict:
        data_bundle['keyNum'] = reqDict['keyNum']
    if 'frequency' in reqDict:
        data_bundle['frequency'] = reqDict['frequency']

    msg1 = oscbuildparse.OSCMessage("/fundamental", None, data_bundle['fundamentals'])
    msg2 = oscbuildparse.OSCMessage("/harmonicity", None, data_bundle['harmonicities'])
    msg3 = oscbuildparse.OSCMessage("/amp_curve", None, data_bundle['amp_curves'])
    msg4 = oscbuildparse.OSCMessage("/delay/multiple", None, data_bundle['delay_multiples'])
    msg5 = oscbuildparse.OSCMessage("/delay/feedback", None, data_bundle['delay_feebacks'])
    msg6 = oscbuildparse.OSCMessage("/keyNum", None, [data_bundle['keyNum']])
    msg7 = oscbuildparse.OSCMessage("/frequency", None, [data_bundle['frequency']])
    bun = oscbuildparse.OSCBundle(oscbuildparse.OSC_IMMEDIATELY,
                        [msg1, msg2, msg3, msg4, msg5, msg6, msg7])
    osc_send(bun, "local")
    osc_process()
