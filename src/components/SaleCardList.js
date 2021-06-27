import React from 'react';
import {Component} from 'react';
import SaleCard from './SaleCard';
class SaleCardList extends Component {
    render() {
      const { tokens } = this.props;
      
      return (
        <div className="card-list">
          {tokens.map((token, idx) => {
              
            return <SaleCard
                key={idx}
                tokenID={token.tokenId}
                src={token.src}
                title={token.title}
                imageId={token.imageId}
                author={token.author}
                dataCreated={token.dateCreated}
                price={token.price}
            />
          })}
        </div>
      )


    }
  }
  
  export default SaleCardList;