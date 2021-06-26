import React from "react";
import { url_end_point } from '../configs.js'

export class Bot extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            bot: {}
        };
        this.bot_id = props.bot_id;
    }


    getStatus(){
        fetch(url_end_point+"/bot/status/"+this.bot_id+"/")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    bot: result
                });
            }
        );
    }

    componentDidMount() {
        setInterval(
            () => this.getStatus(),
            1000
        );
    }


    change_status = (status) => {
        if(status == "start"){
            fetch(url_end_point+"/bot/run/"+this.bot_id+"/");
        }else if(status == "stop"){
            fetch(url_end_point+"/bot/stop/"+this.bot_id+"/");
        }
    }

    render(){
        let botManagerButton;
        if(this.state.bot.status == "running"){
            botManagerButton = <button class="btn btn-warning" onClick={() => this.change_status("stop")}>Stop</button>
        }else if(this.state.bot.status == "fail"){
            botManagerButton = <button class="btn btn-warning" onClick={() => this.change_status("start")}>Start</button>
        }else{
            botManagerButton = <button class="btn btn-success" onClick={() => this.change_status("start")}>Start</button>
        }
        return (
            <div class="col-sm col-3 border">
                <div>
                    <h3>Bot panel</h3>
                </div>
                {botManagerButton}
                <div id="logsBox">
                    <p>{this.state.bot.logs}</p>
                </div>
            </div>
        );
    }

}
