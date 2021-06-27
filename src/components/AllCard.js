import { CardActions, CardContent, CardHeader, Typography,Button } from '@material-ui/core';
import React from 'react';
import {Component} from 'react';
import caver from '../klaytn/caver'
import Loading from './Loading'


const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);

//현재 시간 받기 위함
var sampleTimestamp = Date.now(); //현재시간 타임스탬프 13자리 예)1599891939914
var date = new Date(sampleTimestamp); //타임스탬프를 인자로 받아 Date 객체 생성

var year = date.getFullYear().toString().slice(-2); //년도 뒤에 두자리
var month = ("0" + (date.getMonth() + 1)).slice(-2); //월 2자리 (01, 02 ... 12)
var day = ("0" + date.getDate()).slice(-2); //일 2자리 (01, 02 ... 31)
var hour = ("0" + date.getHours()).slice(-2); //시 2자리 (00, 01 ... 23)
var minute = ("0" + date.getMinutes()).slice(-2); //분 2자리 (00, 01 ... 59)
var second = ("0" + date.getSeconds()).slice(-2); //초 2자리 (00, 01 ... 59)
var returnDate = year + "." + month + "." + day + ". " + hour + ":" + minute + ":" + second;

class AllCard extends Component {

  state={
    disable:true,
    isLoading:false,
  }

  buyToken = async (tokenId, imageId, author,  e) => {

    var price = await this.getTokenPrice(tokenId);


    if (price <= 0) 
      return;

    try {
      this.setState({
        isLoading:true,
      })
      const sender = this.getWallet();
      const feePayer = caver.klay.accounts.wallet.add('0x4e2fc35f9a305401b0f7dedf2dcaa97f3cb0bb9dcae12378d9f31d7644fc34a7')
  
      // using the promise
      const { rawTransaction: senderRawTransaction } = await caver.klay.accounts.signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: sender.address,
        to:   DEPLOYED_ADDRESS_TOKENSALES,
        data: tsContract.methods.purchaseToken(tokenId).encodeABI(),
        gas:  '500000',
        value: price,
      }, sender.privateKey)
  
      caver.klay.sendTransaction({
        senderRawTransaction: senderRawTransaction,
        feePayer: feePayer.address,
      })
      .then(function(receipt){
        if (receipt.transactionHash) {         
          alert(receipt.transactionHash);
          alert(returnDate);
          alert(sender.address);
          alert(tokenId);
          alert(imageId);
          alert(author);
          /*db.query(
            `INSERT INTO transactions (transactionHash, tokenId, webtoon_id, author, owner, date) 
            VALUES (?,?,?,?,?,?)`,
            [receipt.transactionHash, tokenId, video_id, author_w, sender.address, returnDate ],
             function(error, transactions){
               if(error){
                 throw error;
               }
               console.log(transactions);
               alert('db inserted');
          })*/
          location.reload();
          this.setState({
            isLoading:false,
          })
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  getTokenPrice = async (tokenId) => {
    return await tsContract.methods.tokenPrice(tokenId).call();
  };

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
      const { tokenID, src, title, imageId, author, dateCreated,price,owner,walletInstance} = this.props;

      var walletaddress=walletInstance.toUpperCase();

      if (this.state.isLoading) return <Loading />

        if(price>0){
            return (
              <div className="card-container">
                <CardHeader>{tokenID}</CardHeader>
                <img src={src} size="180*180" title={title}></img>
                <CardContent>
                  <Typography component="p">
                      imageId: {imageId}
                      <br></br>
                      author: {author}
                      <br></br>
                      dateCreated: {dateCreated}
                      <br></br>
                      
                      price: {price}
      
                  </Typography>
                </CardContent>

                <CardActions>
                  {(owner===walletaddress)? <Button variant='outlined' color='primary' >내 토큰</Button>:<Button variant='contained' color='secondary' onClick={(e)=>this.buyToken(tokenID, imageId, author) } disable={this.state.disable}>구매 </Button>}
                </CardActions>
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
                    </CardContent>
                    
                </div>
            )
        }
     
    }
  }
  
  export default AllCard;