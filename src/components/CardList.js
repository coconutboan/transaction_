import React from 'react';
import {Component} from 'react';
import Card from './Card';

class CardList extends Component {

    render() {

      const { tokens } = this.props;
      
      return (

        <div className="card-list">
          {tokens.map((token, idx) => {
              
            return <Card
                key={idx}
                tokenID={token.tokenId}
                src={token.src}
                title={token.title}
                imageId={token.imageId}
                author={token.author}
                dataCreated={token.dateCreated}
                price={token.price}
                approve={token.approve}
            />
          })}
        </div>
      )


    }
  }
  
  export default CardList;