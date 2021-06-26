from message import Message


class Processor:
    def __init__(self, message:Message, context):
        self.message = message
        self.context = context
    
    def execute(self):
        pass