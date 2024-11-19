/*
  Smarty Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/

import { RawProvider, TokenMaxAbsoluteAmount, TokenZeroAmount } from './types';
import * as wallet from './wallet-api';
import { Web3Api, Web3ApiEvent, Web3ApiProvider } from './web3-api';
import { clearLastWeb3ApiName, getLastWeb3ApiName, storeLastWeb3ApiName } from './web3-api-history';
import { Web3Common } from './Web3Common';

export {
  RawProvider,
  Web3Common,
  Web3Api,
  Web3ApiEvent,
  Web3ApiProvider,
  storeLastWeb3ApiName,
  getLastWeb3ApiName,
  clearLastWeb3ApiName,
  TokenMaxAbsoluteAmount,
  TokenZeroAmount,
  wallet,
};
