/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/


import {RawProvider} from './types';


export type Web3ApiEvent =
  'connecting'
  | 'connected'
  | 'accountsChanged'
  | 'disconnected';


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