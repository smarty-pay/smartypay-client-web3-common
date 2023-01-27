/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/


const storeKey = 'smartypay-last-connected-wallet';

export function storeLastWeb3ApiName(name: string){
  try {
    window.localStorage.setItem(storeKey, name);
  } catch (e){
    // ignore
  }
}

export function getLastWeb3ApiName(): string {
  try {
    return window.localStorage.getItem(storeKey) || '';
  } catch (e){
    return '';
  }
}


export function clearLastWeb3ApiName(){
  try {
    window.localStorage.setItem(storeKey, '');
  } catch (e){
    // ignore
  }
}