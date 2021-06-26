import React from "react";
import {Form, Modal, Button, Alert} from 'react-bootstrap';
import { url_end_point } from '../configs.js'
export class Handler_remove extends React.Component{

    constructor(props){
        super(props);
        this.state = {
          handler: props.handler,
          error: ""
        };
        this.handler = props.handler;

    }

    remove = (event) => {
      event.preventDefault();
      let method = "DELETE";
      let URL = url_end_point+"/handlers/"+this.props.handler.pk+"/";
      fetch(URL, {method: method})
      .then(() => {
        this.props.onHide(this.props.index);
        this.props.updateView();
      });
    }

    render(){
      let handler = this.props.handler;
      console.log(handler);
      if(handler == null){
        return <p></p>
      }else{
        return (
          <Modal show={this.props.show} onHide={() => this.props.onHide(this.props.index)}>
            <Modal.Header closeButton>
              <Modal.Title>Handler #{ handler.pk }</Modal.Title>
            </Modal.Header>
              <Modal.Body>
                <Alert variant='warning'>Are you sure to delete this handler?</Alert>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => this.props.onHide(this.props.index)}>Cancel</Button>
                <Button variant="primary" type="submit" onClick={(event) => this.remove(event)}>Yes</Button>
              </Modal.Footer>
          </Modal>
        )
      }

    }
}
