from .end_point import end_point
import requests

class HTTPApi_EndPoint(end_point):
    def __init__(self, bot_model, **configs):
        super().__init__(**configs)
        self.bot = bot_model
        if 'url' not in configs:
            raise ValueError("Expected url in config end point")
        if 'node_payload' not in configs:
            self.configs['node_payload'] = "data"
        if 'method' not in configs:
            self.configs['method'] = 'get'

    
    def execute(self):        
        url = self.configs["url"]
        method = self.configs["method"]
        node_payload = self.configs['node_payload']
        payload = {
            "bot_id": self.bot.pk
        }
        if method == "get":
            request = requests.get(url, data=payload)
        elif method == "post":
            request = requests.post(url, data=payload)
        self.response = request.json()[node_payload]
        if request.status_code == 200:
            return True
        return False
    
    def get_response(self):
        return self.response