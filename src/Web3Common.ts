/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/

import {Blockchains, Erc20ABI, Network, Token} from 'smartypay-client-model';
import Web3 from "web3";
import BigNumber from 'bignumber.js';
import {ProviderLike, UseLogs} from './types';

/**
 * Common API for all blockchains and wallets
 */
export const Web3Common = {

  ...UseLogs,

  async getTokenBalance(token: Token, ownerAddress: string): Promise<string> {

    const {network, tokenId, decimals} = token;
    const {rpc} = Blockchains[network];

    // readonly methods can be called without wallet
    const web3 = new Web3(rpc);

    const contract = new web3.eth.Contract(Erc20ABI as any, tokenId);
    const balance = await contract.methods.balanceOf(ownerAddress).call();

    return new BigNumber(balance).shiftedBy(decimals).toString();
  },

  async getTokenAllowance(token: Token, ownerAddress: string, spenderAddress: string): Promise<string>{

    const {network, tokenId, decimals} = token;
    const {rpc} = Blockchains[network];

    // readonly methods can be called without wallet
    const web3 = new Web3(rpc);

    const contract = new web3.eth.Contract(Erc20ABI as any, tokenId);
    const allowance = await contract.methods.allowance(ownerAddress, spenderAddress).call();
    return new BigNumber(allowance).shiftedBy(decimals).toString();
  },

  async switchWalletToAssetNetwork(web3: Web3, token: Token){

    const {network} = token;
    const {chainIdHex, chainId} = Blockchains[network];

    const walletChainId = await web3.eth.getChainId();
    if(walletChainId !== chainId){
      if(UseLogs.useLogs()) {
        console.log('switch wallet network', {from: walletChainId, to: chainIdHex});
      }
      await Web3Common.switchWalletToNetwork(web3, network);
    }
  },


  async switchWalletToNetwork(web3: Web3, network: Network){

    const {chainIdHex, chainName, native, rpc, explorer} = Blockchains[network];

    if( ! web3.currentProvider){
      throw new Error('web3.currentProvider is undefined')
    }

    const result = await (web3.currentProvider as ProviderLike).request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: chainIdHex,
        chainName,
        nativeCurrency: {
          name: native,
          symbol: native,
          decimals: 18,
        },
        rpcUrls: [rpc],
        blockExplorerUrls: [explorer],
      }],
    });

    if(UseLogs.useLogs()){
      console.log('wallet switch network result', result);
    }
  }

}