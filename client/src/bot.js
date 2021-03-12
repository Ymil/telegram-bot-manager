import React from "react";
import { Handler_form } from "./handler_forms.js"
import { PlusCircle, CardText, ArrowRight, Wrench } from 'react-bootstrap-icons';


function StatusFlag(props){
    console.log(props);
    if(props.status == "running"){
        return (
                <li class="nav-item bg-success active"><a class="nav-link">Running</a></li>
        );
    }else if(props.status == "exited"){
        return <li class="nav-item bg-secondary active"><a class="nav-link">Not running</a></li>
    }else{
        return <li class="nav-item bg-danger active"><a class="nav-link">Running</a></li>
    }    
}


class Handler_box extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            handlers: [],
            handler_new: {pk:0, name:'', command:'/', payload: {type:'message', content:''}, form: false},
            handler: {},
            show_form: false
        };
        this.bot_id = props.bot_id;
    }

    
    getHandler(){
        fetch("http://localhost:8000/api/handlers/?bot="+this.bot_id+"")
        .then(res => res.json())
        .then(
            (result) => {                
                this.setState({
                    handlers: result,
                    handler: {
                        pk:0,
                        name: '',
                        command: ''
                    }
                });
                console.log(result);
            }
        );
    }

    componentDidMount() {        
        this.getHandler();
    }

    handler_enabled_change = (handler_idx, handler_id, e) => {
        console.log(e.target.checked);
        fetch("http://localhost:8000/api/handlers/"+handler_id+"/", {
            method: "PUT", 
            body:JSON.stringify({"enabled": e.target.checked}), 
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let handlers = this.state.handlers;
        handlers[handler_idx].enabled = e.target.checked; 
        this.setState({
            handlers: handlers
        });
    }

    handler_form = (index) => {        
        
        if(index == 0){
            let handler_new = this.state.handler_new;
            this.state.handler_new.form = !this.state.show_form;
            this.setState({
                handler_new: handler_new
            });
        }else{
            let handlers = this.state.handlers;
            handlers[index].form = !this.state.show_form;
            this.setState({
                handlers: handlers,
                show_form: handlers[index].form
            });
        }
        return 

    }
    refresh_view = () => {        
        this.getHandler();
    }
    render(){
        let handlers = this.state.handlers;

        return (
            <div class="col-sm border">
            <h2>Handlers</h2>
            <table class="table">
                <tr>
                    <th>ID</th>
                    <th>Name</th>                                    
                    <th>Command</th>                                    
                    <th>Response</th>
                    <td class='tools'>
                        <button class="btn btn-secondary">
                            <PlusCircle size={20} onClick={() => this.handler_form(0)}/>
                        </button>
                        <Handler_form bot={this.bot_id} handler={this.state.handler_new} show={this.state.handler_new.form} onHide={this.handler_form} index={0} updateView={() => this.refresh_view()}/>
                    </td> 
                </tr>
                {handlers.map((handler, index) => {
                    let EnableButton;
                    if(handler.enabled == true){
                        EnableButton = <input type="checkbox" value={handler.enabled} checked onChange={(e) => this.handler_enabled_change(index, handler.pk, e)}></input>
                    }else{
                        EnableButton = <input type="checkbox" value={handler.enabled} onChange={(e) => this.handler_enabled_change(index, handler.pk, e)}></input>
                    }
                    return <tr>
                            <td>{handler.pk}</td>
                            <td>{handler.name}</td>                                            
                            <td>{handler.command}</td>
                            <td>{EnableButton}</td>
                            <td class='tools'>
                                <button class="btn btn-secondary">
                                    <ArrowRight size={20}/>
                                </button> 
                                <button class="btn btn-secondary">
                                    <Wrench size={20} onClick={() => this.handler_form(index)}/>
                                </button>
                            </td>
                            <td><Handler_form handler={handler} show={handler.form} onHide={this.handler_form} index={index} updateView={() => this.refresh_view()}/></td>
                        </tr>
                })}
            </table>
                
            </div>
            
        )
    }
}
class Bot_manager_box extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            bot: {}
        };
        this.bot_id = props.bot_id;
    }
    

    getStatus(){
        fetch("http://localhost:8000/api/bot/status/"+this.bot_id+"/")
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
            fetch("http://localhost:8000/api/bot/run/"+this.bot_id+"/");
        }else if(status == "stop"){
            fetch("http://localhost:8000/api/bot/stop/"+this.bot_id+"/");
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
                <h2>Bot Manager</h2> {botManagerButton}
                <div id="logsBox">
                    <p>{this.state.bot.logs}</p>
                </div>
            </div>
        );
    }

}

export class Bot extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            bot: {},
            bot_status: {status: '', logs:''},
            users: [],
            handlers: []

        };

        this.bot = {
            error: null,
            isLoaded: false,
            data : {}
        };

        this.users = {
            error: null,
            isLoaded: false,
            data : []
        }

        this.handlers = {
            error: null,
            isLoaded: false,
            data : []
        }
        this.bot_id = this.props.match.params.bot_id;
        
    }
    getStatus(){
        fetch("http://localhost:8000/api/bot/status/"+this.bot_id+"/")
        .then(res => res.json())
        .then(
            (result) => {                
                this.setState({
                    bot_status: result
                });
            }
        );
    }

    fetchBot(){
        fetch("http://localhost:8000/api/bots/"+this.bot_id+"/")
          .then(res => res.json())
          .then(
            (result) => {
                
              this.setState({
                  bot: result
              });
              //this.fetchBotsStatus(); 
              console.log("AAA");
              console.log(this.state.bot);
            },
            // Nota: es importante manejar errores aquí y no en 
            // un bloque catch() para que no interceptemos errores
            // de errores reales en los componentes.
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )

    }

    

    getUser(){
        fetch("http://localhost:8000/api/users/?bot="+this.bot_id+"")
        .then(res => res.json())
        .then(
            (result) => {                
                this.setState({
                    users: result
                });
                console.log(result);
            }
        );
    }

    getHandler(){
        fetch("http://localhost:8000/api/handlers/?bot="+this.bot_id+"")
        .then(res => res.json())
        .then(
            (result) => {                
                this.setState({
                    handlers: result
                });
                console.log(result);
            }
        );
    }

    componentDidMount() {
        this.fetchBot();
        this.getUser();
    }

    

    user_enabled_response_change = (user_idx, user_id, e) => {
        console.log(e.target.checked);
        fetch("http://localhost:8000/api/users/"+user_id+"/", {
            method: "PUT", 
            body:JSON.stringify({"response_enabled": e.target.checked}), 
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let users = this.state.users;
        users[user_idx].response_enabled = e.target.checked; 
        this.setState({
            users: users
        });
    }

    


    render(){
        console.log(this.state);
        let botManagerButton;
        let users = this.state.users;
        let handlers = this.state.handlers;
        
        return (
            <div>
                <nav class="navbar navbar-expand navbar-light navbar-dark  bg-primary">            
                    <a class="navbar-brand">{this.state.bot.name}</a>                    
                    <ul class="navbar-nav my-2 my-lg-0">
                        <li class="nav-item active">
                            <StatusFlag status={this.state.bot_status.status}/>
                        </li>
                    </ul>
                </nav>
                <div class="container-fluid" id="main">
                    <div class="row">
                        <Bot_manager_box bot_id={this.bot_id} />
                        <Handler_box bot_id={this.bot_id} />
                    </div>
                    <div class="row">
                        <div class="col-sm border">
                            <h2>Users</h2>
                            <table class="table">
                                <tr>
                                    <th>ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th></th>
                                    <th></th>
                                    <th>Response</th>
                                </tr>
                                {users.map((user, index) => {
                                    let EnableButton;
                                    if(user.response_enabled == true){
                                        EnableButton = <input type="checkbox" value={user.response_enabled} checked onChange={(e) => this.user_enabled_response_change(index, user.pk, e)}></input>
                                    }else{
                                        EnableButton = <input type="checkbox" value={user.response_enabled} onChange={(e) => this.user_enabled_response_change(index, user.pk, e)}></input>
                                    }
                                    return <tr>
                                        <td>{user.pk}</td>
                                        <td>{user.first_name}</td>
                                        <td>{user.last_name}</td>
                                        <td>{user.groups}</td>
                                        <td>{user.profile.name}</td>
                                        <td>
                                            <form>
                                                {EnableButton}
                                            </form>
                                        </td>
                                        <td class='tools'>
                                            <button class="btn btn-secondary">
                                                <ArrowRight size={20} />
                                            </button> 
                                            <button class="btn btn-secondary">
                                                <Wrench size={20} />
                                            </button>
                                            <button class="btn btn-secondary">
                                                <CardText size={20} />
                                            </button>
                                        </td>                                      
                                    </tr>
                                }                                   
                                )}
                                
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}