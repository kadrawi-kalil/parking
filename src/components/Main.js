import React, { Component } from 'react';
import Identicon from 'identicon.js';
import { NavDropdown } from 'react-bootstrap';
class Main extends Component {

  render() {


    return (
      <div className="container mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              <h2>Reserve Place</h2>
            {!this.props.owner?  <form onSubmit={(event) => {
                event.preventDefault()
                const description = this.placeDescription.value
                const date = this.placeDate.value
                const time = this.placeTime.value
                const nbHour = this.placeNbHour.value
                this.props.uploadPlace(description,date,time,nbHour)
              }} >
                <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
                  <div className="form-group mr-sm-2">
                    <br></br>
                      <input
                        id="placeDescription"
                        type="text"
                        ref={(input) => { this.placeDescription = input }}
                        className="form-control"
                        defaultValue="2569 TN 201"
                        required />
                        <input
                        id="placeDate"
                        type="date"
                        ref={(input) => { this.placeDate = input }}
                        className="form-control"
                        defaultValue='20/05/2020'
                        required />
                         <input
                        id="placeTime"
                        type="time"
                        ref={(input) => { this.placeTime = input }}
                        className="form-control"
                        
                        required />
                         <input
                        id="placeNbHour"
                        type="number"
                        ref={(input) => { this.placeNbHour = input }}
                        className="form-control"
                        placeholder="3"
                        defaultValue='1'
                        required />
                  </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">Upload!</button>
              </form>:
               <input 
            
               key="random1"
               value={this.props.input}
               placeholder={"search country"}
               onChange={(e) => this.props.onChange(e.target.value)}
              />}
              <p>&nbsp;</p>
              { this.props.places.map((place, key) => {
                return(
                  <div className="card mb-4" key={key} >
                    <div className="card-header">
                      <img
                        className='mr-2'
                        width='30'
                        height='30'
                        src={`data:place/png;base64,${new Identicon(place.author, 30).toString()}`}
                      />
                      <small className="text-muted">{place.author}</small>
                    </div>
                    <ul id="placeList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p className="text-center"><img src={`https://ipfs.infura.io/ipfs/${place.hash}`} style={{ maxWidth: '420px'}}/></p>
                        <p>{place.description}</p>
                        <p>{place.date}</p>
                        <p>{place.time}</p>
                        <p>{place.nbHour}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          TIPS: {window.web3.utils.fromWei(place.tipAmount.toString(), 'Ether')} ETH
                        </small>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={place.id}
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                            console.log(event.target.name, tipAmount)
                            this.props.tipPlaceOwner(event.target.name, tipAmount)
                          }}
                        >
                          TIP 0.1 ETH
                        </button>
                        
                      </li>
                    </ul>
                  </div>
                )
              })}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;