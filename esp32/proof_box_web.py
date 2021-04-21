import picoweb
import utime
import ujson
import uos

from web_interface import Web_Interface

app = picoweb.WebApp(__name__)

def get_mime_type(fname):
    # Provide minimal detection of important file
    # types to keep browsers happy
    if fname.endswith(".html"):
        return "text/html"
    if fname.endswith(".css"):
        return "text/css"
    if fname.endswith(".png") or fname.endswith(".jpg"):
        return "image"
    return "text/plain"

def sendfile(writer, fname, content_type=None, headers=None):
    if not content_type:
        content_type = get_mime_type(fname)
    try:
        if(fname not in uos.listdir()):
            yield from picoweb.http_error(writer, "404")
        else:
            with open(fname) as f:
                yield from picoweb.start_response(writer, content_type, "200", headers)
                yield from picoweb.sendstream(writer, f)
    except OSError as e:
        if e.args[0] == picoweb.uerrno.ENOENT:
            yield from picoweb.http_error(writer, "404")
        else:
            raise

@app.route('/')
def index(req, resp):
    # yield from picoweb.start_response(resp)
    yield from sendfile(resp,'index.html')

@app.route('/get_status')
def get_status(req, resp):
    status=Web_Interface().get_status()
    tt=utime.localtime()
    status['curr_time']='{}-{}-{} {}:{}:{}'.format(tt[0],tt[1],tt[2],tt[3],tt[4],tt[5])
    ret = {'status':status}
    yield from picoweb.start_response(resp)
    yield from resp.awrite(ujson.dumps(ret))
    pass

@app.route('/get_settings')
def get_settings(req, resp):
    settings=Web_Interface().get_settings()

    ret = {'settings':settings}
    yield from picoweb.start_response(resp)
    yield from resp.awrite(ujson.dumps(ret))
    pass

@app.route('/get_his')
def get_his(req, resp):
    yield from sendfile(resp,'proof_box.db')
    pass

@app.route('/change_settings')
def change_settings(req, resp):
    if req.method == "POST":
        yield from req.read_form_data()
    else:
        req.parse_qs()
    Web_Interface().update_settings(req.form)
    yield from picoweb.start_response(resp)
    yield from resp.awrite("OK")

@app.route('/on_operation')
def on_operation(req, resp):
    if req.method == "POST":
        yield from req.read_form_data()
    else:
        req.parse_qs()
    Web_Interface().on_operation(req.form['operation'])
    yield from picoweb.start_response(resp)
    yield from resp.awrite("OK")

@app.route('/on_reboot')
def on_reboot(req, resp):
    yield from picoweb.start_response(resp)
    yield from resp.awrite("Reboot OK")
    Web_Interface().on_reboot()

@app.route('/get_supported_material')
def get_supported_material(req, resp):
    ret = {'supported_materials':Web_Interface().get_supported_material()}
    yield from picoweb.start_response(resp)
    yield from resp.awrite(ret)

def start_web():
    print('Web Server Start')
    app.run(host='0.0.0.0', port=80, debug=-1)

