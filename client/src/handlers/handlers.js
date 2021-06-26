import React from "react";
import { PlusCircle, CardText, Trash, Gear } from 'react-bootstrap-icons';
import { Handler_form } from "./handler_forms.js"
import { Handler_remove } from "./handler_remove.js"
import { url_end_point } from '../configs.js'
export class Handlers_box extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            handlers: [],
            handler_new: {pk:0, name:'', command:'/', payload: {type:'message', content:''}, form: false},
            handler: {},
            show_form: false,
            show_remove: false,
            handler_active: {}
        };
        this.bot_id = props.bot_id;
    }


    getHandler(){
        fetch(url_end_point+"/handlers/?bot="+this.bot_id+"")
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
        fetch(url_end_point+"/handlers/"+handler_id+"/", {
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

        if(index == "new"){
            let handler_new = this.state.handler_new;
            handler_new.form = !handler_new.form;
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
    handler_remove = (index) => {
        this.setState({
            handler_active: this.state.handlers[index],
            show_remove: !this.state.show_remove
        });

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
                                <PlusCircle size={20} onClick={() => this.handler_form("new")}/>
                            </button>
                            <Handler_form bot={this.bot_id} handler={this.state.handler_new} show={this.state.handler_new.form} onHide={this.handler_form} index={"new"} updateView={() => this.refresh_view()}/>
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
                                        <Gear size={20} onClick={() => this.handler_form(index)}/>
                                    </button>
                                    <button class="btn btn-secondary">
                                        <Trash size={20} onClick={() => this.handler_remove(index)}/>
                                    </button>
                                </td>
                                <Handler_form handler={handler} show={handler.form} onHide={this.handler_form} index={index} updateView={() => this.refresh_view()}/>
                            </tr>
                    })}
                </table>
                <Handler_remove handler={this.state.handler_active} onHide={this.handler_remove} show={this.state.show_remove} updateView={() => this.refresh_view()}/>
            </div>

        )
    }
}
