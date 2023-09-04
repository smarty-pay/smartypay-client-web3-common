/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/

import {Blockchains, abi, Network, Token, Currency, Assets} from 'smartypay-client-model';
import {UseLogs} from './util';
import {BigNumber, ethers} from 'ethers';
import {Web3Api} from './web3-api';
import {JsonProvidersManager} from './util/JsonProvidersManager';
import {TxReqProp} from './types';


const DefaultTxConfirms = 1;

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

    const contract = new ethers.Contract(tokenId, abi.Erc20ABI, provider);
    const balance = await contract.balanceOf(ownerAddress);
    return ethers.utils.formatUnits(balance, decimals);
  },

  async getTokenAllowance(token: Token, ownerAddress: string, spenderAddress: string): Promise<string>{

    const {network, tokenId, decimals} = token;
    const {rpc} = Blockchains[network];

    // readonly methods can be called without wallet
    const provider = JsonProvidersManager.getProvider(rpc);

    const contract = new ethers.Contract(tokenId, abi.Erc20ABI, provider);
    const allowance = await contract.allowance(ownerAddress, spenderAddress);
    return ethers.utils.formatUnits(allowance, decimals);
  },

  async getContractForWallet(
    web3Api: Web3Api,
    contractAddress: string,
    abi: any,
  ){
    const walletAddress = await web3Api.getAddress();
    const provider = new ethers.providers.Web3Provider(web3Api.getRawProvider() as any);
    return new ethers.Contract(contractAddress, abi, provider.getSigner(walletAddress));
  },

  async walletTokenApprove(
    web3Api: Web3Api,
    token: Token,
    _ownerAddress: string, // deprecated: using "web3Api.getAddress()"
    spenderAddress: string,
    approveAbsoluteAmount: string,
    prop?: TxReqProp): Promise<string> {

    await Web3Common.switchWalletToAssetNetwork(web3Api, token);

    const {tokenId} = token;

    const walletAddress = await web3Api.getAddress();
    const provider = new ethers.providers.Web3Provider(web3Api.getRawProvider() as any);
    const contract = new ethers.Contract(tokenId, abi.Erc20ABI, provider.getSigner(walletAddress));

    // call tx
    const txResp = await contract.approve(spenderAddress, approveAbsoluteAmount);
    const {transactionHash} = await txResp.wait(prop?.waitConfirms || DefaultTxConfirms);

    return transactionHash;
  },

  async switchWalletToAssetNetwork(web3Api: Web3Api, token: Token){
    await Web3Common.switchWalletToNetwork(web3Api, token.network);
  },


  async switchWalletToNetwork(web3Api: Web3Api, network: Network){

    const {chainId, chainIdHex, chainName, native, rpc, explorer} = Blockchains[network];

    const walletChainId = await web3Api.getChainId();
    if(walletChainId === chainId){
      return;
    }

    if(UseLogs.useLogs()) {
      console.log('switch wallet network', {from: walletChainId, to: chainId});
    }

    const provider = web3Api.getRawProvider();

    // try to switch to existing network in wallet:
    try {

      const result = await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{
          chainId: chainIdHex
        }]
      });

      // success
      if(UseLogs.useLogs()) {
        console.log('wallet switch to existing network result', result);
      }
      return;

    } catch (e: any){

      const msg: string = e.message || e.toString() || '';

      // no need to continue
      if(msg.toLowerCase().includes('user rejected')){
        throw e;
      }
    }

    // next: try to add network to wallet:
    const result = await provider.request({
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

  async addCurrencyTokenToWallet(web3Api: Web3Api, currency: Currency) {
    const token = (Assets as any)[currency] as Token|undefined;
    if(token){
      await this.addTokenToWallet(web3Api, token);
    } else if(UseLogs.useLogs()){
      console.log('cannot add unknown token', currency);
    }
  },

  async addTokenToWallet(web3Api: Web3Api, token: Token) {

    // need to use target network first
    await Web3Common.switchWalletToNetwork(web3Api, token.network);

    const provider = web3Api.getRawProvider();

    try {

      await provider.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: token.tokenId,
            symbol: token.abbr,
            decimals: token.decimals,
          },
        } as any,
      });

      if(UseLogs.useLogs()) {
        console.log('added token', token.abbr);
      }

    } catch (e: any){
      if(UseLogs.useLogs()){
        console.log('cannot add token', e.message || e.toString());
      }
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

  toBigNumber(value: any){
    return BigNumber.from(value)
  },

  toDecimalForm(amount: any, token: Token): string {
    return ethers.utils.formatUnits(amount, token.decimals);
  },

  toHexString(value: any): string {
    return BigNumber.from(value).toHexString();
  },

  toNumberFromHex(value: string): number {
    return BigNumber.from(value).toNumber();
  }

}