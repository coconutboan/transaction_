import React from 'react';
import {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CardList from './CardList'
import SaleCardList from './SaleCardList'
import AllCardList from './AllCardList'
import TabPanel from './TabPanel'

import './TokenTabs.css'



class TokenTabs extends Component{
    state={
        value:0,
    }

    a11yProps = (index) => {

        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };

    }

    handleChange = async (event, newValue) => {//appbar
        this.setState({ 
            value: newValue 
        });
    }

    render() {

        const {mytokens, mysaletokens, alltokens }=this.props;

        return (
            <div>
                <AppBar position="static">
                    <Tabs value={this.state.value} onChange={this.handleChange} indicatorColor="primary" textColor="secondary" variant="fullWidth" aria-label="simple tabs example">
                        <Tab label="내 보유 토큰" {...this.a11yProps(0)} />
                        <Tab label="내 판매 중 토큰" {...this.a11yProps(1)} />
                        <Tab label="모든 토큰" {...this.a11yProps(2)} />
                    </Tabs>
                </AppBar>
                
                <TabPanel value={this.state.value} index={0}>
                    <CardList tokens={mytokens} />
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                    <SaleCardList tokens={mysaletokens}/>
                </TabPanel>
                <TabPanel value={this.state.value} index={2}>
                    <AllCardList tokens={alltokens}/>
                </TabPanel>
            </div>
        );
    }
}

export default TokenTabs;
