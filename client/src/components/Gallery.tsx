import React from 'react';
import { getNftDetails } from '../utils/nft';
import { useVenomWallet } from '../hooks/useVenomWallet';

type Props = {
  // array of strings wit himage urls
  collectionsItems: string[] | undefined;
  isLoading?: boolean;
  title?: string;
  listIsEmpty?: boolean;
};
function Gallery({ collectionsItems, title, listIsEmpty, isLoading }: Props) {
  console.log(collectionsItems,"here");
  return (
    <div className="lots">
      {title && <h1>{title}</h1>}
      {listIsEmpty && <h1>The list is empty</h1>}
      <div className="lots__list">
        {
          collectionsItems?.map((item, index) => (
            // on clicking on image go to /campaign-details/
            <a href={`/campaign-details/${index}`}>
              <div className="lots__item" key={`${index} ${item}`}>
                <img src={item} alt="img" />
              </div>
            </a>
          ))
        }
      </div>
    </div>
  );
}
export default Gallery;