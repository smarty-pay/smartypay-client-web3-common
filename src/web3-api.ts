/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/

import Web3 from 'web3';


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