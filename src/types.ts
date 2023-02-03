/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/

export const TokenMaxAbsoluteAmount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
export const TokenZeroAmount = '0x0';

export interface RawProvider {
  /**
   * Sends a raw request by wallet's raw provider itself
   */
  request(options: SendOptions): Promise<any>,
}


export interface SendOptions {
  method: string;
  params: any[];
  id?: number;
  jsonrpc?: string;
}


export interface TxReqProp {
  waitConfirms?: number
}
