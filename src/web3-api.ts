/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/


import {RawProvider} from './types';

export interface Web3ApiListener {
  onConnected?(): void,
  onAccountsChanged?(newAddress: string): void;
  onDisconnectedByRemote?(): void;
}


export interface Web3Api {

  addListener(listener: Web3ApiListener): void,

  removeListener(listener: Web3ApiListener): void,

  name(): string,

  hasWallet(): boolean,

  isConnected(): boolean,

  connect(): Promise<void>,

  getAddress(): Promise<string>,

  getChainId(): Promise<number>,

  getRawProvider(): RawProvider,

  disconnect(): Promise<void>,
}