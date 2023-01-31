/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/

import {SubscriptionABI, Token} from 'smartypay-client-model';
import {Web3Common} from './Web3Common';
import {UseLogs} from './util';
import {Web3Api} from './web3-api';
import {ethers} from 'ethers';


export const Web3Subscriptions = {

  ...UseLogs,

  async pauseInBlockchain(web3Api: Web3Api, token: Token, ownerAddress: string, contractAddress: string){

    await Web3Common.switchWalletToAssetNetwork(web3Api, token);

    const provider = new ethers.providers.Web3Provider(web3Api.getRawProvider() as any, "any");
    const contract = new ethers.Contract(contractAddress, SubscriptionABI, provider);

    const txResult = await contract.freeze()({
      from: ownerAddress
    });

    if(UseLogs.useLogs()){
      console.log('pause tx result', txResult);
    }
  },

  async unpauseInBlockchain(web3Api: Web3Api, token: Token, ownerAddress: string, contractAddress: string){

    await Web3Common.switchWalletToAssetNetwork(web3Api, token);

    const provider = new ethers.providers.Web3Provider(web3Api.getRawProvider() as any, "any");
    const contract = new ethers.Contract(contractAddress, SubscriptionABI, provider);

    const txResult = await contract.unfreeze()({
      from: ownerAddress
    });

    if(UseLogs.useLogs()) {
      console.log('unpause tx result', txResult);
    }
  },
}