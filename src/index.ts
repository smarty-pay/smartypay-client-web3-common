/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/

import {RawProvider, TokenMaxAbsoluteAmount, TokenZeroAmount} from './types';
import {Web3Common} from './Web3Common';
import {
  Web3Api,
  Web3ApiEvent,
  Web3ApiProvider,
} from './web3-api';
import * as wallet from './wallet-api';
import {
  storeLastWeb3ApiName,
  getLastWeb3ApiName,
  clearLastWeb3ApiName,
} from './web3-api-history';

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
}
