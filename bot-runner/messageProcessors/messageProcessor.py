class MessageProcessor:
    def __init__(self, msg, **context_variables):
        self.msg = msg
        self.context_variables = context_variables