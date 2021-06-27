import React from 'react';
import {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

class TabPanel extends Component{

    render() {
        return (
          <Typography component="div" hidden={this.props.value !== this.props.index}>
            <Box p={3}>
              {this.props.children}
            </Box>
          </Typography>
        );
      }
}

export default TabPanel;
