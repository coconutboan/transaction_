import React from 'react';
import {Component} from 'react';
import Button from '@material-ui/core/Button';
import caver from '../klaytn/caver'
import Loading from './Loading'
import './TokenApprove.css'

const wttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);


class TokenApprove extends Component{
    state={
        isLoading:false,
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

    approve = () =>  {

        this.setState({
            isLoading:true
        })

        const walletInstance = this.getWallet();
          
        wttContract.methods.setApprovalForAll(DEPLOYED_ADDRESS_TOKENSALES, true).send({
          from: walletInstance.address,
          gas: '250000'
        }).then(function (receipt) {
          
            if (receipt.transactionHash) {
                location.reload();
                this.setState({
                    isLoading:false
                })
            }
        });

    }
    
    cancelApproval = async () => {

        this.setState({
            isLoading:true
        })

        const walletInstance = this.getWallet();
          
        const receipt = await wttContract.methods.setApprovalForAll(DEPLOYED_ADDRESS_TOKENSALES, false).send({
          from: walletInstance.address,
          gas: '250000'
        })
      
        if (receipt.transactionHash) {
            await this.onCancelApprovalSuccess(walletInstance);
            location.reload();
            this.setState({
                isLoading:false
            })
        }

    }

    onCancelApprovalSuccess = async  (walletInstance) => {

        var balance = parseInt(await this.getBalanceOf(walletInstance.address));
    
        if (balance > 0) {

          var tokensOnSale = [];

          for (var i = 0; i < balance; i++) {
            var tokenId = await this.getTokenOfOwnerByIndex(walletInstance.address, i);
            var price = await this.getTokenPrice(tokenId);

            if (parseInt(price) > 0)
              tokensOnSale.push(tokenId);

          }
    
          if (tokensOnSale.length > 0) {
            const receipt = await tsContract.methods.removeTokenOnSale(tokensOnSale).send({
              from: walletInstance.address,
              gas: '250000'
            });
    
            if (receipt.transactionHash)
              alert(receipt.transactionHash);
          }
        }

    }

    getBalanceOf = async function (address) {
        return await wttContract.methods.balanceOf(address).call();
    }
    getTokenOfOwnerByIndex = async (address, index) => {
        return await wttContract.methods.tokenOfOwnerByIndex(address, index).call();
    }
    getTokenPrice = async (tokenId) => {
        return await tsContract.methods.tokenPrice(tokenId).call();
    }


    render() {

        if (this.state.isLoading) return <Loading />

        return (
            <div className='approvebuttons'>
                <div className='approve'>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={this.approve}
                    disabled={this.props.approvedisable}> 
                    토큰 판매 승인
                </Button>
                </div>
                <div className='cancelapprove'>
                <Button 
                    variant="contained" 
                    color="secondary"
                    onClick={this.cancelApproval}
                    disabled={this.props.approvecanceldisable}> 
                    토큰 판매 승인 취소
                </Button>
                </div>
            </div>
        );
    }
}

export default TokenApprove;
