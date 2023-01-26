/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/

export interface ProviderLike {
  /**
   * Sends a raw request to the JSON RPC server.
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