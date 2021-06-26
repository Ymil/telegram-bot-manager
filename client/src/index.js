import React from "react";
import ReactDOM from "react-dom";
import './styles.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { url_end_point } from './configs.js'


import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { Bot_manager } from './bot_manager.js'

export default function App() {

  return (
    <Router>
      <div>
        <nav class="navbar navbar-expand-lg  navbar-dark  bg-primary">
            <a class="navbar-brand">Telegram bot manager</a>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <navBar />

            </div>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/bot/:bot_id" component={Bot_manager} />
          <Route path="/">
            <Bots />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}


class Bots extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            data: {}
        }

    }


    ingresar = (id) => {
        window.location.href = "/bot/"+id;
    }

    fetchBots(){
        fetch(url_end_point+"/bots/")
          .then(res => res.json())
          .then(
            (result) => {
                const newState = JSON.parse(JSON.stringify(result));
                for( let i = 0; i < result.length; i++){
                    fetch(url_end_point+"/bot/status/"+result[i].pk+"/")
                    .then(res => res.json())
                    .then(

                        (result_2) => {
                            console.log("Register status "+newState[i].pk);
                            newState[i].status = result_2.status;
                            console.log(newState[i].status);
                            this.setState({
                                isLoaded: true,
                              items: newState
                            });
                        }
                    );
                }
              this.setState({
                  isLoaded: true,
                items: newState
              });
              //this.fetchBotsStatus();
              console.log(this.state.items);
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

    fetchBotsStatus(){
        const newState = JSON.parse(JSON.stringify(this.state));
        console.log(this.state);
        for (let i = 0; i < this.state.items.length; i++) {
            console.log(this.state.items[i].pk);
            fetch(url_end_point+"/bot/status/"+this.state.items[i].pk+"/")
            .then(res => res.json())
            .then(
                (result) => {
                    newState.items[i].status = result.status;
                }
            );
            }
        console.log(newState);
        newState.isLoaded = true;
        this.setState(newState);
    }
    componentDidMount() {
        this.fetchBots();
    }

    render() {
            console.log(this.state);
            const { error, isLoaded, items } = this.state;
            if (error) {
              return <div>Error: {error.message}</div>;
            } else if (!isLoaded) {
              return <div>Loading...</div>;
            } else {
              return (
                <table class="table">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th></th>
                    </tr>

                  {items.map(items =>
                    <tr>
                        <td>{items.pk}</td>
                        <td>{items.name}</td>
                        <td>{items.status}</td>
                        <td><button type="button" class="btn btn-primary" onClick={() => this.ingresar(items.pk)}>Ingresar</button></td>
                    </tr>
                  )}
                </table>
              );
            }
          }
        }


ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
