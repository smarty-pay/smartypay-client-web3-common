/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/

import {Blockchains, Erc20ABI, Network, Token} from 'smartypay-client-model';
import {TxReqProp, UseLogs} from './util';
import {ethers} from 'ethers';
import {Web3Api} from './web3-api';
import {JsonProvidersManager} from './util/JsonProvidersManager';


const DefaultTxConfirms = 8;

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

  async walletTokenApprove(
    web3Api: Web3Api,
    token: Token,
    ownerAddress: string,
    spenderAddress: string,
    approveAbsoluteAmount: string,
    prop?: TxReqProp): Promise<string> {

    await Web3Common.switchWalletToAssetNetwork(web3Api, token);

    const {tokenId} = token;

    const provider = new ethers.providers.Web3Provider(web3Api.getRawProvider() as any);
    const contract = new ethers.Contract(tokenId, Erc20ABI, provider.getSigner());

    // call tx
    const txResp = await contract.approve(spenderAddress, approveAbsoluteAmount);
    const {transactionHash} = await txResp.wait(prop?.waitConfirms || DefaultTxConfirms);

    return transactionHash;
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
  },

  /**
   * See chars registers:
   * <pre>
   * "0x14186c8215985f33845722730c6382443bf9ec65"
   * ->
   * "0x14186C8215985f33845722730c6382443Bf9EC65"
   * </pre>
   */
  getNormalAddress(address: string): string {
    return ethers.utils.getAddress(address);
  },

  toAbsoluteForm(amount: string, token: Token){
    return ethers.utils.parseUnits(amount, token.decimals);
  },

  toDecimalForm(amount: any, token: Token): string {
    return ethers.utils.formatUnits(amount, token.decimals);
  }

}