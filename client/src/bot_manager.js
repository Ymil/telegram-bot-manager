import React from "react";
import { CardText, ArrowRight, Wrench } from 'react-bootstrap-icons';
import { Handlers_box } from "./handlers/handlers.js"
import { Users } from "./users/users.js"
import { Bot } from "./bot/bot.js"


export class Bot_manager extends React.Component{
    constructor(props){
        super(props);      
        this.bot_id = this.props.match.params.bot_id;
        
    }    

    render(){
        console.log(this.state);
        return (
            <div>
                <h2>Bot Manager</h2>
                <div class="container-fluid" id="main">
                    <div class="row">
                        <Handlers_box bot_id={this.bot_id} />
                        <Users bot_id={this.bot_id} />                        
                    </div>
                    <div class="row">
                        <Bot bot_id={this.bot_id} />
                    </div>
                    
                </div>
            </div>
        )
    }
}