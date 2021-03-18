import telegram.update
import telegram.user

class Message:
    def __init__(self, update: telegram.update.Update):
        self.update = update
        self.command = update.message.text.split(" ")[0]
        self.args = update.message.text.split(" ")[0:]
    
    def get_user_data(self) -> telegram.user.User:
        return self.update.message.from_user
    
    def get_chat_id(self) -> str:
        return self.update.message.chat_id
    
    def get_command(self) -> [str, list]:
        return (self.command, self.get_args)
    
    def get_args(self) -> list:
        return self.args