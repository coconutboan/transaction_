import React from 'react';
import {Component} from 'react';

import './Page.css'
import caver from '../klaytn/caver'
import {connect} from 'react-redux';
import {Button} from '@material-ui/core';

import * as authActions from '../redux/actions/auth'

import TokenApprove from './TokenApprove'
import TokenTabs from './TokenTabs'
import TokenIssue from './TokenIssue'


 
const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);

var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });



class Page extends Component{
  constructor(props){
    super(props);
    this.state = {
      tokenstate:'',
      totaltokenstate:'',
      mytokens: [],
      mysaletokens: [],
      alltokens:[],
      update:false,
    }
  }
  
  update = () => {

    const walletFromSession = sessionStorage.getItem('walletInstance');
    this.changeUI(JSON.parse(walletFromSession));

    this.setState({
      update: true
    })

  }

  changeUI = async (walletInstance) => { 
      
    await this.displayMyTokensAndSale(walletInstance);
    await this.displayAllTokens(walletInstance);
    await this.checkApproval(walletInstance);

  }

  displayMyTokensAndSale = async (walletInstance) => {       
    
    var balance = parseInt(await this.getBalanceOf(walletInstance.address));
      
    if (balance === 0) {
      this.setState({
        tokenstate:"현재 발행된 토큰이 없습니다."
      })
    } else {
      var isApproved = await this.isApprovedForAll(walletInstance.address, DEPLOYED_ADDRESS_TOKENSALES);
      var tokenList = new Array();
      for (var i = 0; i < balance; i++) {
        
        (async () => {

          var tokenId = await this.getTokenOfOwnerByIndex(walletInstance.address, i);
          var tokenUri = await this.getTokenUri(tokenId);
          var wtt = await this.getWTT(tokenId);
          var metadata = await this.getMetadata(tokenUri);
          var price = await this.getTokenPrice(tokenId);        

          
          var data = new Object();
          data.tokenId=tokenId;
          data.src=metadata.properties.image.description;
          data.title=metadata.properties.description.description;
          data.imageId=metadata.properties.name.description;
          data.author=wtt[0];
          data.dataCreated=wtt[1];
          data.price=parseInt(price);
          
          if(isApproved){//cancel되면 버튼이 사라지게 해줘야함. mytoken tab에서
            data.approve=1;
          }else{
            data.approve=0;
          }
          
          
          tokenList.push(data);

          this.setState({
            mytokens: tokenList
          }) 

          if(data.price>0){//가격이 0이상이라는 건 판매중이라는 것. mysaletoken tab에 들어갈 수 애들
            this.setState({
              mysaletokens: tokenList
            })
          }

        })();
      }
      console.log(this.state.mytokens);//이게 없으면 error

    }
  }

  displayAllTokens = async (walletInstance) => {   

    var totalSupply = parseInt(await this.getTotalSupply());

    if (totalSupply === 0) {
      this.setState({
        totaltokenstate:'현재 발행된 토큰이 없습니다'
      })
    } else {
      var tokenList = new Array();

      for (var i = 0; i < totalSupply; i++) {

        (async () => {
          var tokenId = await this.getTokenByIndex(i);
          var tokenUri = await this.getTokenUri(tokenId);
          var wtt = await this.getWTT(tokenId);
          var metadata = await this.getMetadata(tokenUri);
          var price = await this.getTokenPrice(tokenId); 
          var owner = await this.getOwnerOf(tokenId);

          var data = new Object();
          data.tokenId=tokenId;
          data.src=metadata.properties.image.description;
          data.title=metadata.properties.description.description;
          data.imageId=metadata.properties.name.description;
          data.author=wtt[0];
          data.dataCreated=wtt[1];
          data.price=parseFloat(caver.utils.fromPeb(price,'KLAY')+"KLAY");
          data.owner=owner.toUpperCase();
          data.walletInstance=walletInstance.address;


          tokenList.push(data);
    
          this.setState({
            alltokens: tokenList
          })  

        })();
      }
    }
  }

  checkApproval= async (walletInstance) => {

    var isApproved = await this.isApprovedForAll(walletInstance.address, DEPLOYED_ADDRESS_TOKENSALES);
    
    if (isApproved) {
      this.setState({
        approvedisable: true,
        approvecanceldisable: false
      })
    } else {
      this.setState({
        approvedisable: false,
        approvecanceldisable: true
      })
    } 

  }

  handleLogout = (e) =>{

    const { logout } = this.props;
    logout();

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

  getOwnerOf= async (tokenId) =>{
    return await wttContract.methods.ownerOf(tokenId).call();
  }
  getTotalSupply= async () => {
    return await wttContract.methods.totalSupply().call();
  }
  getTokenByIndex = async (index) => {
    return await wttContract.methods.tokenByIndex(index).call();
  }
  getTokenPrice = async (tokenId) => {
    return await tsContract.methods.tokenPrice(tokenId).call();
  }
  isApprovedForAll = async (owner, operator) => {
    return await wttContract.methods.isApprovedForAll(owner, operator).call();
  }
  getMetadata = (tokenUri) => {
    return new Promise((resolve) => {
      console.log(tokenUri);//getJSON은 jquery라 사용못함.
        fetch(tokenUri)
        .then(res => res.json())
        .then(data => resolve(data));
    })
  }
  getWTT = async (tokenId) => {
    return await wttContract.methods.getWTT(tokenId).call();
  }
  getTokenUri = async (tokenId) => {
    return await wttContract.methods.tokenURI(tokenId).call();
  }
  getTokenOfOwnerByIndex = async (address, index) => {
    return await wttContract.methods.tokenOfOwnerByIndex(address, index).call();
  }
  getBalanceOf = async function (address) {
    return await wttContract.methods.balanceOf(address).call();
  }


  render(){

    if (!this.state.update) this.update();
    
    return(
      
      <div>

        <div className="Logout">
          <Button 
            variant="contained"
            color="default"
            onClick={this.handleLogout}> 
            로그아웃
          </Button>
        </div>
        
        
        <TokenIssue />
        <TokenApprove approvedisable={this.state.approvedisable} approvecanceldisable={this.state.approvecanceldisable} />
        <TokenTabs mytokens={this.state.mytokens} mysaletokens={this.state.mysaletokens} alltokens={this.state.alltokens}/>
      
      </div>
    )
  }
}


const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(authActions.logout()),
  })

export default connect(null,mapDispatchToProps)(Page);