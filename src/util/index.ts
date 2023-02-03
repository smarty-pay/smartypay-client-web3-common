/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/

let useLogs = true;

export const UseLogs = {

  setUseLogs(val: boolean){
    useLogs = val;
  },

  useLogs(){
    return useLogs;
  },
}