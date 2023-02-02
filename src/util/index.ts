/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/


export const TokenMaxAbsoluteAmount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

export interface TxReqProp {
  waitConfirms?: number
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