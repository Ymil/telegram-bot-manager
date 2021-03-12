class end_point:
    def __init__(self, **configs):
        
        self.configs = configs
        self.response = ''
    
    def execute(self) -> bool:
        return False
    
    def get_response(self) -> str:
        return self.response

