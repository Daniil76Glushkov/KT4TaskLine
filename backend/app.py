import json
import time

from flask import Flask, Response

app = Flask(__name__)


@app.get("/api/progress")
def progress():
    def generate():
        for value in [20, 40, 60, 80, 100]:
            time.sleep(1)
            data = json.dumps({"progress": value})
            yield f"event: progress\ndata: {data}\n\n"

        data = json.dumps({"message": "Задача выполнена!"}, ensure_ascii=False)
        yield f"event: complete\ndata: {data}\n\n"

    return Response(
        generate(),
        mimetype="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
