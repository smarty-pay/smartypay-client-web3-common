/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/

import Web3 from 'web3';


let currentApi: Web3Api;

export const Web3ApiHolder = {

  current(){
    return currentApi;
  },

  setCurrent(web3Api: Web3Api){
    currentApi = web3Api;
  }
};


export interface Web3ApiListener {
  onConnected?(): void,
  onAccountsChanged?(newAddress: string): void;
  onDisconnectedByRemote?(): void;
}


export interface Web3Api {

  addListener(listener: Web3ApiListener): void,

  removeListener(listener: Web3ApiListener): void,

  web3(): Web3,

  name(): string,

  hasWallet(): boolean,

  isConnected(): boolean,

  connect(): Promise<void>,

  getAddress(): Promise<string>,

  disconnect(): Promise<void>,
}