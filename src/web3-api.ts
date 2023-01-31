/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/


import {RawProvider} from './types';
import {util} from 'smartypay-client-model';


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


export interface MakeWeb3ApiOpt {
  listeners?: util.ListenersMap<any>,
}

export interface Web3ApiProvider {

  makeWeb3Api(req: MakeWeb3ApiOpt): Web3Api;

}