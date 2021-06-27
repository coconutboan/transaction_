import React from 'react';
import {Component} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TokenCreate from './TokenCreate';
import './TokenIssue.css'

class TokenIssue extends Component{
    state={
        open:false,
    }

    handleClickOpen = () => {

        this.setState({
          open: true
        });

    }

    handleClose = () => {

        this.setState({
        open: false
        })

    }

    render() {
        return (
            <div className="dialogopen">
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={this.handleClickOpen}> 
                    WTT토큰 발행
                </Button>

                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <TokenCreate />
                    <Button variant="contained" color="default" onClick={this.handleClose}> 닫기</Button>
                </Dialog>
            </div>
        );
      }
}

export default TokenIssue;
