import React from 'react';
import {Component} from 'react';
import caver from '../klaytn/caver'
import {DialogContent, DialogActions, Button } from '@material-ui/core'

const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);

var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

class TokenCreate extends Component {
    state={
        imageId: '',
        title: '',
        author: '',
        dateCreated: '',
        createdisabled: false,
    }
    handleValueChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value,
        },()=>console.log(this.state.privateKey))
      }
    checkTokenExists = async (e) => {   
        var imageId = this.state.imageId;
        console.log(imageId);
        var result = await this.isTokenAlreadyCreated(imageId);
        
        if (result) {
          this.setState({
            createdisabled: true
          });
          alert("이미 토큰화된 웹툰입니다.")
        } else {
          alert("토큰화 가능한 웹툰입니다.")
        }
      }
    
    createToken = async (e) => { 
        e.preventDefault();  
        var imageId = this.state.imageId;
        var title = this.state.title;
        var author = this.state.author;
        var dateCreated = this.state.dateCreated;
        console.log(this.state.title);
        if (!imageId || !title || !author || !dateCreated) {
          console.log("입력 부족");
          return;
        }
        
        try {
          const metaData = this.getERC721MetadataSchema(imageId, title, `https://img.youtube.com/vi/${imageId}/mqdefault.jpg`);
          var res = await ipfs.add(Buffer.from(JSON.stringify(metaData)));
          await this.mintWTT(imageId, author, dateCreated, res[0].hash);
        } catch (err) {
          console.error(err);
        }
      };
    
    getERC721MetadataSchema = (imageId, title, imgUrl) => {
        return {
          "title": "Asset Metadata",
          "type": "object",
          "properties": {
            "name": {
                "type": "string",
                "description": imageId
            },
            "description": {
                "type": "string",
                "description": title
            },
            "image": {
                "type": "string",
                "description": imgUrl
            }
          }
        }
      }
    
    mintWTT = async (imageId, author, dateCreated, hash) => {    
        const sender = this.getWallet(); 
        console.log(sender.address); //함수를 호출하는 계정  //가스비 대신 내주는 계정
        const feePayer = caver.klay.accounts.wallet.add('0xa42c3e961699cfd3c02d5a68dadff9840f72b70099fd0f456c59be34f3fe7efd')
            
        // using the promise
        const { rawTransaction: senderRawTransaction } = await caver.klay.accounts.signTransaction({
          type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
          from: sender.address,
          to:   DEPLOYED_ADDRESS,
          data: wttContract.methods.mintWTT(imageId, author, dateCreated, "https://ipfs.infura.io/ipfs/" + hash).encodeABI(),
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
          }       
        });
      }

    getWallet = () => {
        try{
          if (caver.klay.accounts.wallet.length) {
            console.log("here");
            return caver.klay.accounts.wallet[0]
          }
        }catch(e){
          console.error(e);
        }
      };

    
        
      
    
    isTokenAlreadyCreated = (imageId) => {
        try{
          return wttContract.methods.isTokenAlreadyCreated(imageId).call();
        }catch(e){
          console.error(e);
        }
      }


    render() {
      return (
        <div>
            
            <DialogContent>
                        <label >웹툰 ID
                        <input type="text" className="image-id" name="imageId" onChange={this.handleValueChange} />
                        <Button variant='contained' color='default' className="checkExists" onClick={this.checkTokenExists}>중복확인</Button>
                        </label>
                        <br /><br />
                        <label >제목
                        <input className="form-control" type="text" name="title" onChange={this.handleValueChange}></input>
                        <br /><br />
                        
                        </label>
                        <label >작가
                        <input className="form-control" type="text" name="author" onChange={this.handleValueChange}></input>
                        <br /><br />
                        </label>

                        <label >게시일
                        <input className="form-control" type="text" name="dateCreated" onChange={this.handleValueChange}></input>
                        </label>
            </DialogContent>
            <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.createToken} disabled={this.state.createdisabled}> 제출</Button>
                    
            </DialogActions>

        </div>
      )
    }
  }
  
  export default TokenCreate;