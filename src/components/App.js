import Decentragram from '../abis/Decentragram.json'
import React, { Component } from 'react';
import Identicon from 'identicon.js';
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    console.log('account',accounts[0]);
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = Decentragram.networks[networkId]
    if(networkData) {
      const decentragram = new web3.eth.Contract(Decentragram.abi, networkData.address)
      this.setState({ decentragram })
      const placesCount = await decentragram.methods.placeCount().call()
      const owner = await decentragram.methods.owner().call()
      console.log('owner',owner);
      this.setState({ owner })
      this.setState({ placesCount })
      // Load places
      for (var i = 1; i <= placesCount; i++) {
        const place = await decentragram.methods.places(i).call()
        console.log("place",place.author);
        this.setState({
          places: [...this.state.places, place]
        })
        console.log(place.author+"==="+placesCount)
        if(place.author===this.state.account){
          
          this.setState({
          clientplace: [...this.state.clientplace, place]
          })
        }

      }
      // Sort places. Show highest tipped places first
      this.setState({
        places: this.state.places.sort((a,b) => b.tipAmount - a.tipAmount )
      })
      this.setState({ loading: false})
    } else {
      window.alert('Decentragram contract not deployed to detected network.')
    }
  }

  captureFile = event => {

    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  uploadPlace = (description,date,time,nbHour) => {
    console.log("Submitting file to ipfs...")

    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }

      this.setState({ loading: true })
      this.state.decentragram.methods.uploadPlace(result[0].hash, description,date,time,nbHour).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  tipPlaceOwner(id, tipAmount) {
    this.setState({ loading: true })
    this.state.decentragram.methods.tipPlaceOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      decentragram: null,
      places: [],
      clientplace: [],
      loading: true,
      owner: ''
    }

    this.uploadPlace = this.uploadPlace.bind(this)
    this.tipPlaceOwner = this.tipPlaceOwner.bind(this)
    this.captureFile = this.captureFile.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              places={this.state.owner ===this.state.account?this.state.places:this.state.clientplace}
              captureFile={this.captureFile}
              uploadPlace={this.uploadPlace}
              tipPlaceOwner={this.tipPlaceOwner}
            />
        }
      </div>
    );
  }
}

export default App;