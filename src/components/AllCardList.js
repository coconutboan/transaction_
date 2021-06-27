import React from 'react';
import {Component} from 'react';
import AllCard from './AllCard';
class AllCardList extends Component {
    render() {
      const { tokens } = this.props;
      
      return (
        <div className="card-list">
          {tokens.map((token, idx) => {
              
            return <AllCard
                key={idx}
                tokenID={token.tokenId}
                src={token.src}
                title={token.title}
                imageId={token.imageId}
                author={token.author}
                dataCreated={token.dateCreated}
                price={token.price}
                owner={token.owner}
                walletInstance={token.walletInstance}
            />
          })}
        </div>
      )


    }
  }
  
  export default AllCardList;