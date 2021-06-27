import { CardActions, CardContent, CardHeader, CardMedia,Typography } from '@material-ui/core';
import React from 'react';
import {Component} from 'react';
class SaleCard extends Component {

  render() {

    const { tokenId, src, title, imageId, author, dateCreated,price} = this.props;

    if(price>0){//판매중인 토큰

      return (

        <div className="card-container">
          <CardHeader>{tokenId}</CardHeader>
          <img src={src} size="180*180" title={title}></img>
          <CardContent>
            imageId: {imageId}
            <br></br>
            author: {author}
            <br></br>
            dateCreated: {dateCreated}
            <br></br>
            price: {price}
          </CardContent>
        </div>
      )

    }else{

      return(
        <div>
              
        </div>
      )
    }
     
  }
}
  
  export default SaleCard;