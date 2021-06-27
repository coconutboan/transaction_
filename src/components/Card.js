import { CardActions, CardContent, CardHeader, Button } from '@material-ui/core';
import React from 'react';
import {Component} from 'react';
import caver from '../klaytn/caver'
import Loading from './Loading'
import './Card.css'

const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);

class Card extends Component {
  constructor(props){
    super(props);
    this.state={
      inputprice: 0,
      isLoading: false,
    }
  }

  handleInput = (e) => {
    this.setState({
     inputprice: e.target.value
    })
  }

  getWallet = () => {
    try{
      if (caver.klay.accounts.wallet.length) {
        return caver.klay.accounts.wallet[0]
      }
    }catch(e){
      console.error(e);
    }
  };

      

  render() {
    const { tokenID,src, title, imageId, author, dateCreated, price, approve} = this.props;

    if (this.state.isLoading) return <Loading />

    const sellToken = async (tokenId, e) => {   
    
      const {inputprice} = this.state;
      
      if (inputprice <= 0) 
        return;
    
      try {

        this.setState({
          isLoading: true,
        })

        const sender = this.getWallet();
        const feePayer = caver.klay.accounts.wallet.add('0x4e2fc35f9a305401b0f7dedf2dcaa97f3cb0bb9dcae12378d9f31d7644fc34a7')
      
        
        const { rawTransaction: senderRawTransaction } = await caver.klay.accounts.signTransaction({
          type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
          from: sender.address,
          to:   DEPLOYED_ADDRESS_TOKENSALES,
          data: tsContract.methods.setForSale(tokenId, caver.utils.toPeb(inputprice, 'KLAY')).encodeABI(),
          gas:  '500000',
          value: caver.utils.toPeb('0', 'KLAY'),
        }, sender.privateKey)
      
        caver.klay.sendTransaction({
          senderRawTransaction: senderRawTransaction,
          feePayer: feePayer.address,
        })

        .then(function(receipt){

          if (receipt.transactionHash) {      
             
            alert(receipt.transactionHash);
            location.reload();
            this.setState({
              isLoading: false,
            })
          }
        });
      } catch (err) {
        console.error(err);
      }
    }


    if(approve==0){
      return (
        <div className="card-container">
          <CardHeader>{tokenID}</CardHeader>
          <img src={src} size="180*180" title={title}></img>
          <CardContent>
            imageId: {imageId}
            <br></br>
            author: {author}
            <br></br>
            dateCreated: {dateCreated}
            <br></br>
          </CardContent>
        </div>
      )
    }else{

      if(price>0){

        return(
          <div className="card-container">
            <CardHeader>{tokenID}</CardHeader>
            <img src={src} size="180*180" title={title}></img>
            <CardContent>
              imageId: {imageId}
              <br></br>
              author: {author}
              <br></br>
              dateCreated: {dateCreated}
              <br></br>
              price: {price}
              <br></br>
            </CardContent>
          </div>
        )

      }else{
            
        return (

          <div className="card-container">
            <CardHeader>{tokenID}</CardHeader>
            <img src={src} size="180*180" title={title}></img>
            <CardContent>
              imageId: {imageId}
              <br></br>
              author: {author}
              <br></br>
              dateCreated: {dateCreated}
              <br></br>
              <CardActions>
              <input 
                type="number"
                placeholder="KLAY"
                step="0.01"
                value={this.state.inputprice}
                onChange={this.handleInput}/>
              
              <Button variant='contained' color='primary' onClick={(e)=>sellToken(tokenID)}>
                판매
              </Button>

              </CardActions>
            </CardContent>

            
          </div>
        )
      }

    }
     
  }
}
  
  export default Card;