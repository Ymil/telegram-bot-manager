import React from "react";
import {Form, Modal, Button, Alert} from 'react-bootstrap';
import { url_end_point } from '../configs.js'
function Payload_Render(props){
  if(props.payload.type == "message"){
    return (
    <div>
      <Form.Group>
        <Form.Label>Payload type</Form.Label>
        <Form.Control as="select" value={props.payload.type} onChange={(e) => props.change(e)} name='payload_type'>
          <option value='message'>Message</option>
          <option value='http'>HTTP</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Payload content</Form.Label>
        <Form.Control as="textarea" value={props.payload.content} onChange={(e) => props.change(e)} name='payload_content'/>
      </Form.Group>
    </div>
    )
  }else if(props.payload.type == "http"){

    return (
    <div>
      <Form.Group>
        <Form.Label>Payload type</Form.Label>
        <Form.Control as="select" value={props.payload.type} onChange={(e) => props.change(e)} name='payload_type'>
          <option value='message'>Message</option>
          <option value='http'>HTTP</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Payload method</Form.Label>
        <Form.Control as="select" value={props.payload.method} onChange={(e) => props.change(e)} name='payload_method'>
          <option value='get'>GET</option>
          <option value='post'>POST</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Payload URL</Form.Label>
        <Form.Control type="url" value={props.payload.url} onChange={(e) => props.change(e)} name='payload_url'/>
      </Form.Group>
    </div>
    )
  }else{
    return <p></p>
  }
}
export class Handler_form extends React.Component{

    constructor(props){
        super(props);
        this.state = {
          handler: props.handler,
          error: ""
        };
        this.handler = props.handler;
    }



    change = (event) => {
      let input_name = event.target.name;
      let input_value = event.target.value;
      if(input_name == "payload_type"){
        this.handler.payload.type = input_value;
      }else if(input_name == "payload_content"){
        this.handler.payload.content = input_value;
      }else if(input_name == "payload_method"){
        this.handler.payload.method = input_value;
      }else if(input_name == "payload_url"){
        this.handler.payload.url = input_value;
      }else{
        this.handler[input_name] = input_value;
      }

      this.setState({
          handler: this.handler
      });


    }


    save = (event) => {
      let target = event.target;
      let response = {
        name: target.name.value,
        command: target.command.value,
        payload:{
          type: target.payload_type.value
        }
      }

      if(target.payload_type.value == "message"){
        response.payload.content = target.payload_content.value;
      }else if(target.payload_type.value == "http"){
        response.payload.method = target.payload_method.value;
        response.payload.url = target.payload.url.value;
      }
      event.preventDefault();
      let method = "POST";
      let URL = url_end_point+"/handlers/"
      response.bot = this.props.bot;
      if(this.state.handler.pk != 0){
        method = "PUT";
        URL += this.state.handler.pk+"/"
      }
      fetch(URL, {
            method: method,
            body:JSON.stringify(response),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
          response.json().then(json => {
              if(response.status < 300){
                this.props.onHide(this.props.index);
                this.props.updateView()

              }else{
                this.setState({
                    error: json.description
                } );

              }
          })
      });


    }

    render(){
      let handler = this.state.handler;

      if(handler == null){
        return <p></p>
      }else{
        return (
          <Modal show={this.props.show} onHide={() => this.props.onHide(this.props.index)}>
            <Modal.Header closeButton>
              <Modal.Title>Handler #{ handler.pk }</Modal.Title>
            </Modal.Header>
            <Form onSubmit={(e) => this.save(e)}>
              <Modal.Body>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={handler.name} onChange={(e) => this.change(e)} name='name' />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Command</Form.Label>
                    <Form.Control type="text" value={handler.command} onChange={(e) => this.change(e)} name='command'/>
                  </Form.Group>
                  <Payload_Render payload={handler.payload} change={this.change} />
              </Modal.Body>
              <Modal.Body>
                { this.state.error.length > 0 ? <Alert variant="danger">{this.state.error}</Alert> : null }
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => this.props.onHide(this.props.index)}>Close</Button>
                <Button variant="primary" type="submit">Save changes</Button>
              </Modal.Footer>
            </Form>
          </Modal>
        )
      }

    }
}
