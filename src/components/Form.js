import React from 'react';
import {Component} from 'react';
//import {ReactDom} from 'react';
import caver from '../klaytn/caver'
import {connect} from 'react-redux'

import * as authActions from '../redux/actions/auth'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from  '@material-ui/core/Button';




const auth= {
  accessType: 'keystore',
  keystore: '',
  password: '',
  message:'',
}

class Form extends Component{
    constructor(props){
        super(props);
        this.state={
            privateKey:'',
            open: false,
        };
    }

    handleImport = (e) => {
        let file=e.target.files[0];
        let fileReader=new FileReader();
        fileReader.onload = () =>{
            try{
                if(!this.checkValidKeystore(fileReader.result)){
                    this.setState({
                        message:'wrong input file...'
                    })

                return;
            }

            this.setState({
                message:'right input file... 패스워드를 입력하세요'
            })
            auth.keystore=fileReader.result;
            }catch(e){
                this.setState({
                    message:'wrong input file...'
                })

                return;
            }
        } 
        fileReader.readAsText(file);
    };

    checkValidKeystore = (keystore) => {
        const parsedKeystore = JSON.parse(keystore);
        const isValidKeystore = parsedKeystore.version &&
        parsedKeystore.id &&
        parsedKeystore.address &&
        parsedKeystore.keyring;

        return isValidKeystore;
    };
    
    handlePassword = (e) => {
        auth.password = e.target.value;
    };

    onSubmit= async (e)=>{
        e.preventDefault();
        if (auth.accessType === 'keystore') {
            try {
                const privateKeys = caver.klay.accounts.decrypt(auth.keystore, auth.password).privateKey;


                await this.setState({
                    privateKey: privateKeys,
                })

                this.handleLogin();

      
            } catch (e) {
                console.error(e);
                alert('login fail');
            }

        }
    };

    handleLogin = (e) => {
        try{
        const { login } = this.props;
        const { privateKey } = this.state;

        login(privateKey)
        alert('login success');
        this.handleClose();
        }catch(e){
            console.error(e);
            alert('login fail')
        }
    }  

    handleClickOpen = () =>{
        this.setState({
            open: true
        });
    }

    handleClose = () => {
        this.setState({
            open: false
        })
    }

    render(){

        return(
            <div>
                <Button className='loginbutton' variant="contained" color="default" onClick={this.handleClickOpen}>
                    로그인
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogContent>
                        <label>
                            Keystore
                            <br /><br />   
                        <input className="keystore" type="file" onChange={this.handleImport}></input>
                        </label>
                        <br /><br />
                        {this.state.message}
                        <br /><br />
                        <label>
                            Password  
                            <br /><br />
                            <input className="input-password" type="password" onChange={this.handlePassword}/>
                        </label>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="default" onClick={this.onSubmit}> 제출</Button>
                        <Button variant="contained" color="default" onClick={this.handleClose}> 닫기</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}


const mapDispatchToProps = (dispatch) => ({
    login: privateKey => dispatch(authActions.login(privateKey)),
  })

export default connect(null,mapDispatchToProps)(Form);
