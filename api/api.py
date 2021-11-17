import time
from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS

from pythonosc import udp_client
from pythonosc import osc_bundle_builder
from pythonosc import osc_message_builder

app = Flask(__name__)
CORS(app)

client = udp_client.SimpleUDPClient("localhost", 5005)

@app.route('/api/query', methods = ['POST'])
def get_query_from_react():
    req = request.get_json()
    send_osc_packet(req['fundamental'], req['harmonicity'], req['decay']
        ,req['exp_base'], req['scalar'])
    return req

def send_osc_packet(funda, harmon, decay, exp_base, scalar):
    bundle = osc_bundle_builder.OscBundleBuilder(
    osc_bundle_builder.IMMEDIATELY)

    msg = osc_message_builder.OscMessageBuilder(address="/fundamental")
    msg.add_arg(funda)
    msg2 = osc_message_builder.OscMessageBuilder(address="/harmonicity")
    msg2.add_arg(harmon)
    msg3 = osc_message_builder.OscMessageBuilder(address="/decay")
    msg3.add_arg(decay)
    msg4 = osc_message_builder.OscMessageBuilder(address="/amp_exponential_base")
    msg4.add_arg(exp_base)
    msg5 = osc_message_builder.OscMessageBuilder(address="/amp_scalar")
    msg5.add_arg(scalar)


    bundle.add_content(msg.build())
    bundle.add_content(msg2.build())
    bundle.add_content(msg3.build())
    bundle.add_content(msg4.build())
    bundle.add_content(msg5.build())
    bundle = bundle.build()
    client.send(bundle)
