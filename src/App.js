import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const urlApi = 'http://localhost:3003/api/student'

class App extends Component {

  state = {
    data: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      studentId: '',
      studentName: '',
      tipoModal: ''
    }
  }

  selectStudent = (student) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        studentId: student.studentId,
        studentName: student.studentName
      }
    })
  }

  getPetition = () => {
    axios.get(urlApi)
      .then(res => this.setState({data: res.data}))
      .catch(err => console.log(err.message))
  }

  postPetition = async () => {
    delete this.state.form.studentId
    await axios.post(urlApi, this.state.form).then(res => {
      this.modalInsertar();
      this.getPetition()
    }).catch(err => console.log(err.message))
  }

  putPetition = () => {
    axios.patch(`${urlApi}/${this.state.form.studentId}`, this.state.form)
      .then(res => {
        this.modalInsertar();
        this.getPetition()
      })
      .catch(err => console.log(err.message))
  }

  delPetition = () => {
    axios.delete(`${urlApi}/${this.state.form.studentId}`)
      .then(res => {
        this.setState({modalEliminar: false})
        this.getPetition()
      })
      .catch(err => console.log(err.message))
  }

  modalInsertar = () => {
    this.setState({modalInsertar: !this.state.modalInsertar})
  }

  handleChange = async (e) => {
    e.persist()
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      },
    })
    console.log(this.state.form, e.target.name)
  }

  componentDidMount() {
    this.getPetition()
  }

  render() {
    const { form } = this.state
    return (
      <div className="App">
        <br /><br /><br />
        <button className="btn btn-success" onClick={() => {this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Estudiante</button>
        <br /><br />
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(student=>{
              return(
                <tr>
                  <td>{student.studentId}</td>
                  <td>{student.studentName}</td>
                  <td>
                      <button className="btn btn-primary" onClick={() => {this.selectStudent(student); this.modalInsertar()}}>Edit</button>
                      {"   "}
                      <button className="btn btn-danger" onClick={() => {this.selectStudent(student); this.setState({modalEliminar: true})}}>Delete</button>
                  </td>
              </tr>
              )
            })}
          </tbody>
        </table>


        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{display: 'block'}}>
            <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="studentId">ID</label>
              <input className="form-control" type="text" name="studentId" id="studentId" readOnly onChange={this.handleChange} value={form ? form.studentId : this.state.data.length+1}/>
              <br />
              <label htmlFor="studentName">Nombre</label>
              <input className="form-control" type="text" name="studentName" id="studentName" onChange={this.handleChange} value={form ? form.studentName : ''}/>
            </div>
          </ModalBody>
          <ModalFooter>
            {this.state.tipoModal==='insertar'
              ? <button className="btn btn-success" onClick={()=>this.postPetition()}>Insertar</button>
              : <button className="btn btn-primary" onClick={()=>this.putPetition()}>Actualizar</button>
            }
              <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
          </ModalFooter>
        </Modal>


          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar al estudiante {form && form.studentName}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.delPetition()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>
      </div>
    );
  }
}

export default App;
