/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/

import {util, Token, Network, Currency} from 'smartypay-client-model';
import {Web3Api, Web3ApiEvent, Web3ApiProvider} from './web3-api';
import {clearLastWeb3ApiName, getLastWeb3ApiName, storeLastWeb3ApiName} from './web3-api-history';
import {Web3Common} from './Web3Common';


export type WalletApiEvent =
  Web3ApiEvent
  | 'wallet-connecting'
  | 'blockchain-transaction'
  | 'api-locked'
  | 'api-unlocked'
  | 'api-error';


export class WalletApi<EventKey> {

  protected listeners = new util.ListenersMap<WalletApiEvent>();
  protected lockOperation: string|undefined;

  // wallet state
  protected activeWalletApi: Web3Api|undefined;
  protected oldWalletApis = new Map<string, Web3Api>();
  protected walletConnecting = false;

  // api state
  protected apiLastError: any = undefined;

  constructor(public readonly name: string) {}

  addListener(event: WalletApiEvent, listener: util.EventListener){
    this.listeners.addListener(event, listener);
  }

  addGlobalListener(listener: util.EventListener){
    this.listeners.addGlobalListener(listener);
  }

  removeListener(listener: util.EventListener){
    this.listeners.removeListener(listener);
  }

  protected fireEvent(key: EventKey, ...args: any[]){
    this.listeners.fireEvent(key as any, ...args);
  }

  async connectToWallet(provider: Web3ApiProvider){
    await this.useApiLock('connectToWallet', async ()=>{

      const walletName = provider.name();

      if(this.activeWalletApi && this.activeWalletApi.name() !== walletName){
        throw util.makeError(this.name, 'Already using other wallet', this.activeWalletApi.name());
      }

      // use old wallet if can
      let wallet = this.oldWalletApis.get(walletName);
      if( ! wallet){

        // make new instance
        wallet = provider.makeWeb3Api();
        this.oldWalletApis.set(walletName, wallet);

        // re-translate events
        wallet.addListener('wallet-connected', ()=>{
          this.listeners.fireEvent('wallet-connected', walletName);
        });
        wallet.addListener('wallet-disconnected', ()=>{
          this.listeners.fireEvent('wallet-disconnected', walletName);
        });
        wallet.addListener('wallet-account-changed', (newAddress: string)=>{
          this.listeners.fireEvent('wallet-account-changed', newAddress);
        });
        wallet.addListener('wallet-network-changed', (chainId: number)=>{
          this.listeners.fireEvent('wallet-network-changed', chainId);
        });
      }

      this.activeWalletApi = wallet;

      // connect to wallet
      this.walletConnecting = true;
      this.listeners.fireEvent('wallet-connecting', true);
      try {

        await wallet.connect();
        storeLastWeb3ApiName(walletName);

      } catch (e){

        // no need of non-connected active wallet
        this.activeWalletApi = undefined;
        clearLastWeb3ApiName();

        throw e;

      } finally {
        this.walletConnecting = false;
        this.listeners.fireEvent('wallet-connecting', false);
      }
    });
  }

  async switchWalletToAssetNetwork(token: Token){
    await this.useApiLock('switchWalletToAssetNetwork', async ()=>{
      const wallet = this.getActiveWallet();
      await Web3Common.switchWalletToAssetNetwork(wallet, token);
    })
  }

  async switchWalletToNetwork(network: Network){
    await this.useApiLock('switchWalletToNetwork', async ()=>{
      const wallet = this.getActiveWallet();
      await Web3Common.switchWalletToNetwork(wallet, network);
    })
  }

  async addCurrencyTokenToWallet(currency: Currency) {
    await this.useApiLock('addCurrencyTokenToWallet', async ()=>{
      const wallet = this.getActiveWallet();
      await Web3Common.addCurrencyTokenToWallet(wallet, currency);
    })
  }

  async addTokenToWallet(token: Token) {
    await this.useApiLock('addTokenToWallet', async ()=>{
      const wallet = this.getActiveWallet();
      await Web3Common.addTokenToWallet(wallet, token);
    })
  }

  getOldConnectedWallet(){
    return getLastWeb3ApiName();
  }

  getWalletName(): string|undefined{
    return this.activeWalletApi?.name();
  }

  isWalletConnected(){
    return this.activeWalletApi?.isConnected() || false;
  }

  isWalletConnecting(){
    return this.walletConnecting;
  }

  async getWalletAddress(){
    if(this.activeWalletApi && this.activeWalletApi.isConnected()){
      return this.activeWalletApi.getAddress();
    }
    return undefined;
  }

  async getWalletChainId(){
    if(this.activeWalletApi && this.activeWalletApi.isConnected()){
      return this.activeWalletApi.getChainId();
    }
    return undefined;
  }

  async disconnectFromWallet(){
    await this.useApiLock('disconnectFromWallet', async ()=>{
      if( ! this.activeWalletApi){
        return;
      }
      const wallet = this.activeWalletApi;
      this.activeWalletApi = undefined;
      clearLastWeb3ApiName();

      try {
        await wallet.disconnect();
      } catch (e){
        console.warn(`${this.name}: Can not correctly disconnect the wallet ${wallet.name()}`, e);
      }
    });
  }

  isApiLocked(){
    return !! this.lockOperation;
  }

  getApiLastError(){
    return this.apiLastError;
  }


  protected async useApiLock<T>(
    opName: string,
    call: (...args: any[])=>Promise<T>
  ): Promise<T|undefined> {

    // use only one blocking operation
    if(this.lockOperation){
      console.warn(`${this.name}: Can't call operation "${opName}" because api is locked by "${this.lockOperation}"`);
      return undefined;
    }


    let result: any;
    let resultError: any;

    this.lockOperation = opName;
    this.listeners.fireEvent('api-locked', opName);
    try {
      result = await call();
    }
    catch (e){
      resultError = e;
    }
    finally {
      this.lockOperation = undefined;
      this.listeners.fireEvent('api-unlocked', opName);
    }

    if(resultError){
      this.updateApiLastError(resultError);
      throw resultError;
    } else {
      return result;
    }
  }

  protected getActiveWallet(): Web3Api {
    if(!this.activeWalletApi){
      throw util.makeError(this.name, 'No wallet to use');
    }
    return this.activeWalletApi;
  }

  protected updateApiLastError(error: any){
    this.apiLastError = error;
    this.listeners.fireEvent('api-error', error);
  }
}


export async function restoreOldWalletConnectionFromAny(
  walletApi: WalletApi<any>,
  ...providers: Web3ApiProvider[]
): Promise<boolean>{
  const oldConnectedWalletName = walletApi.getOldConnectedWallet();
  const provider = providers.find(p => p.name() === oldConnectedWalletName);
  if(provider){
    return restoreOldWalletConnection(walletApi, provider);
  } else {
    return false;
  }
}

async function restoreOldWalletConnection(walletApi: WalletApi<any>, provider: Web3ApiProvider): Promise<boolean>{

  const oldConnectedWalletName = walletApi.getOldConnectedWallet();
  if( oldConnectedWalletName !== provider.name()){
    return false;
  }

  // wallet already connected
  if(walletApi.isWalletConnected()){
    return false;
  }

  try {
    await walletApi.connectToWallet(provider);
    return true;
  } catch (e){
    console.error(`${walletApi.name}: Can not connect to wallet`, e);
    return false;
  }
}