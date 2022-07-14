from flask import (
    Blueprint, make_response, send_from_directory
)

pwa_bp = Blueprint('pwa', __name__, url_prefix='')


@pwa_bp.route('/manifest.json')
def manifest():
    return send_from_directory('static', 'manifest.json')


@pwa_bp.route('/sw.js')
def service_worker():
    response = make_response(send_from_directory('static', 'sw.js'))
    response.headers['Cache-Control'] = 'no-cache'
    return response