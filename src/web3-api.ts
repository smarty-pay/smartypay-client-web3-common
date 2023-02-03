/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/


import {RawProvider} from './types';


export type Web3ApiEvent =
  'wallet-connected'
  | 'wallet-account-changed'
  | 'wallet-network-changed'
  | 'wallet-disconnected';


export interface Web3Api {

  addListener(event:Web3ApiEvent, listener: (...args: any[])=>void): void,

  removeListener(listener: (...args: any[])=>void): void,

  name(): string,

  hasWallet(): boolean,

  isConnected(): boolean,

  connect(): Promise<void>,

  getAddress(): Promise<string>,

  getChainId(): Promise<number>,

  getRawProvider(): RawProvider,

  disconnect(): Promise<void>,
}


export interface Web3ApiProvider {

  name(): string,

  hasWallet(): boolean,

  makeWeb3Api(...args: any[]): Web3Api,

}