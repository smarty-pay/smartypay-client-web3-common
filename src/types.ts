/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/

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


let useLogs = true;

export const UseLogs = {

  setUseLogs(val: boolean){
    useLogs = val;
  },

  useLogs(){
    return useLogs;
  },
}