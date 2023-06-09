import React from 'react';
import { getNftDetails } from '../utils/nft';
import { useVenomWallet } from '../hooks/useVenomWallet';

type Props = {
  collectionsItems: string[] | undefined;
  isLoading?: boolean;
  title?: string;
  listIsEmpty?: boolean;
};

function Gallery({ collectionsItems, title, listIsEmpty, isLoading }: Props) {
  console.log(collectionsItems, "here");
  return (
    <div className="lots">
      {title && <h1>{title}</h1>}
      {listIsEmpty && <h1>The list is empty</h1>}
      <div className="grid grid-cols-3 gap-4">
        {collectionsItems?.map((item, index) => (
          <a href={`/campaign-details/${index}`} key={`${index} ${item}`}>
            <div className="lots__item">
              <img src={item} alt="img" className="object-contain w-full" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Gallery;