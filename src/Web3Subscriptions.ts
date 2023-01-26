/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/

import Web3 from 'web3';
import {SubscriptionABI, Token} from 'smartypay-client-model';
import {Web3Common} from './Web3Common';
import {UseLogs} from './types';


export const Web3Subscriptions = {

  ...UseLogs,

  async pauseInBlockchain(web3: Web3, token: Token, ownerAddress: string, contractAddress: string){

    await Web3Common.switchWalletToAssetNetwork(web3, token);

    const contract = new web3.eth.Contract(SubscriptionABI as any, contractAddress);
    const txResult = await contract.methods.freeze().send({
      from: ownerAddress
    });

    if(UseLogs.useLogs()){
      console.log('pause tx result', txResult);
    }
  },

  async unpauseInBlockchain(web3: Web3, token: Token, ownerAddress: string, contractAddress: string){

    await Web3Common.switchWalletToAssetNetwork(web3, token);

    const contract = new web3.eth.Contract(SubscriptionABI as any, contractAddress);
    const txResult = await contract.methods.unfreeze().send({
      from: ownerAddress
    });

    if(UseLogs.useLogs()) {
      console.log('unpause tx result', txResult);
    }
  },
}