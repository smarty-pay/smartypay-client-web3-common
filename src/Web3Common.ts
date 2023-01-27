/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/

import {Blockchains, Erc20ABI, Network, Token} from 'smartypay-client-model';
import {UseLogs} from './types';
import {ethers} from 'ethers';
import {Web3Api} from './web3-api';
import {JsonProvidersManager} from './JsonProvidersManager';

/**
 * Common API for all blockchains and wallets
 */
export const Web3Common = {

  ...UseLogs,

  jsonProvidersManager: JsonProvidersManager,

  async getTokenBalance(token: Token, ownerAddress: string): Promise<string> {

    const {network, tokenId, decimals} = token;
    const {rpc} = Blockchains[network];

    // readonly methods can be called without wallet
    const provider = JsonProvidersManager.getProvider(rpc);

    const contract = new ethers.Contract(tokenId, Erc20ABI, provider);
    const balance = await contract.balanceOf(ownerAddress);
    return ethers.utils.formatUnits(balance, decimals);
  },

  async getTokenAllowance(token: Token, ownerAddress: string, spenderAddress: string): Promise<string>{

    const {network, tokenId, decimals} = token;
    const {rpc} = Blockchains[network];

    // readonly methods can be called without wallet
    const provider = JsonProvidersManager.getProvider(rpc);

    const contract = new ethers.Contract(tokenId, Erc20ABI, provider);
    const allowance = await contract.allowance(ownerAddress, spenderAddress);
    return ethers.utils.formatUnits(allowance, decimals);
  },

  async switchWalletToAssetNetwork(web3Api: Web3Api, token: Token){

    const {network} = token;
    const {chainIdHex, chainId} = Blockchains[network];

    const walletChainId = await web3Api.getChainId();
    if(walletChainId !== chainId){
      if(UseLogs.useLogs()) {
        console.log('switch wallet network', {from: walletChainId, to: chainIdHex});
      }
      await Web3Common.switchWalletToNetwork(web3Api, network);
    }
  },


  async switchWalletToNetwork(web3Api: Web3Api, network: Network){

    const {chainIdHex, chainName, native, rpc, explorer} = Blockchains[network];

    const result = await web3Api.getRawProvider().request({
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