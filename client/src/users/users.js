import React from "react";
import { PlusCircle, CardText, Trash, Gear } from 'react-bootstrap-icons';

export class Users extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            users: []
        };
        this.bot_id = props.bot_id;
    }   

    getUsers(){
        fetch("http://localhost:8000/api/users/?bot="+this.bot_id+"")
        .then(res => res.json())
        .then(
            (result) => {                
                this.setState({
                    users: result
                });
            }
        );
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

    componentDidMount() {
        this.getUsers();
    }

    render(){
        let users = this.state.users;
        return (
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
                                    <Gear size={20} />
                                </button>
                                <button class="btn btn-secondary">
                                    <Trash size={20} />
                                </button>
                            </td>                                      
                        </tr>
                    }                                   
                    )}
                    
                </table>
            </div>
        );
    }
}
