/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/

import {Web3Common} from './Web3Common';
import {Assets} from 'smartypay-client-model';
import BigNumber from 'bignumber.js';

describe('Web3Common', ()=>{

  const address = '0x14186C8215985f33845722730c6382443Bf9EC65';
  const randomAddress = '0x790ACC251534cb02975A0c61dA94D200bB5833A5'; // from https://vanity-eth.tk/

  const zero = new BigNumber(0);

  describe('getTokenBalance', ()=>{

    test('should support btBUSD', async ()=>{
      const balance = new BigNumber(await Web3Common.getTokenBalance(Assets.btBUSD, address));
      expect(balance.isGreaterThan(zero)).toBe(true);
    });

    test('should support atUSDC', async ()=>{
      const balance = new BigNumber(await Web3Common.getTokenBalance(Assets.atUSDC, address));
      expect(balance.isGreaterThan(zero)).toBe(true);
    });

    test('should support pmUSDC', async ()=>{
      const balance = new BigNumber(await Web3Common.getTokenBalance(Assets.pmUSDC, address));
      expect(balance.isGreaterThan(zero)).toBe(true);
    });
  });


  describe('getTokenAllowance', ()=>{

    test('should support btBUSD', async ()=>{
      const balance = new BigNumber(await Web3Common.getTokenAllowance(Assets.btBUSD, address, randomAddress));
      expect(balance.isEqualTo(zero)).toBe(true);
    });

    test('should support atUSDC', async ()=>{
      const balance = new BigNumber(await Web3Common.getTokenAllowance(Assets.atUSDC, address, randomAddress));
      expect(balance.isEqualTo(zero)).toBe(true);
    });

    test('should support pmUSDC', async ()=>{
      const balance = new BigNumber(await Web3Common.getTokenAllowance(Assets.pmUSDC, address, randomAddress));
      expect(balance.isEqualTo(zero)).toBe(true);
    });
  });

})


