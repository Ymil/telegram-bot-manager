from .processor import Processor

from jinja2 import Template
from message import Message
    
class TextProccesor(Processor):
    def __init__(self, text,  message:Message, context):
        super().__init__(message, context)
        self.text = text
    
    def execute(self):
        template = Template(self.text)
        msg = template.render(vars(self.message.get_user_data()))
        self.context.bot.sendMessage(chat_id=self.message.get_chat_id(), text=msg)