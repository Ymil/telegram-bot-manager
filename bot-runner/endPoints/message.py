from .end_point import end_point


class Message_EndPoint(end_point):
    def __init__(self, **configs):
        super().__init__(**configs)
        if 'content' not in configs:
            raise ValueError('Expected content in config end point')

    def execute(self):
        self.response = self.configs['content']
        return True
