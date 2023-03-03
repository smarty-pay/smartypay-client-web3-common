/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/

import {Web3Common} from './Web3Common';
import {Assets} from 'smartypay-client-model';
import {BigNumber, ethers} from 'ethers';

describe('Web3Common', ()=>{

  const address = '0x14186C8215985f33845722730c6382443Bf9EC65';
  const randomAddress = '0x790ACC251534cb02975A0c61dA94D200bB5833A5'; // from https://vanity-eth.tk/

  const zero = BigNumber.from(0);

  describe('jsonProvidersManager', ()=>{
    test('should use providers cache by default', async ()=>{
      expect(Web3Common.jsonProvidersManager.isUseCache()).toBe(true);
    });
  });

  describe('getTokenBalance', ()=>{

    test('should support btBUSD', async ()=>{
      const doubleForm = await Web3Common.getTokenBalance(Assets.btBUSD, address);
      const absoluteForm = ethers.utils.parseUnits(doubleForm, Assets.btBUSD.decimals);
      expect(absoluteForm.gt(zero)).toBe(true);
    });

    test('should support btMNXe', async ()=>{
      const doubleForm = await Web3Common.getTokenBalance(Assets.btMNXe, address);
      const absoluteForm = ethers.utils.parseUnits(doubleForm, Assets.btMNXe.decimals);
      expect(absoluteForm.gt(zero)).toBe(true);
    });

    test.skip('should support btUSDTv2', async ()=>{
      const doubleForm = await Web3Common.getTokenBalance(Assets.btUSDTv2, address);
      const absoluteForm = ethers.utils.parseUnits(doubleForm, Assets.btUSDTv2.decimals);
      expect(absoluteForm.gt(zero)).toBe(true);
    });

    test('should support atUSDC', async ()=>{
      const doubleForm = await Web3Common.getTokenBalance(Assets.atUSDC, address);
      const absoluteForm = ethers.utils.parseUnits(doubleForm, Assets.atUSDC.decimals);
      expect(absoluteForm.gt(zero)).toBe(true);
    });

    test.skip('should support atUSDT', async ()=>{
      const doubleForm = await Web3Common.getTokenBalance(Assets.atUSDT, address);
      const absoluteForm = ethers.utils.parseUnits(doubleForm, Assets.atUSDT.decimals);
      expect(absoluteForm.gt(zero)).toBe(true);
    });

    test('should support pmUSDC', async ()=>{
      const doubleForm = await Web3Common.getTokenBalance(Assets.pmUSDC, address);
      const absoluteForm = ethers.utils.parseUnits(doubleForm, Assets.pmUSDC.decimals);
      expect(absoluteForm.gt(zero)).toBe(true);
    });

    test.skip('should support pmUSDT', async ()=>{
      const doubleForm = await Web3Common.getTokenBalance(Assets.pmUSDT, address);
      const absoluteForm = ethers.utils.parseUnits(doubleForm, Assets.pmUSDT.decimals);
      expect(absoluteForm.gt(zero)).toBe(true);
    });

    test('should support gUSDC', async ()=>{
      const doubleForm = await Web3Common.getTokenBalance(Assets.gUSDC, address);
      const absoluteForm = ethers.utils.parseUnits(doubleForm, Assets.gUSDC.decimals);
      expect(absoluteForm.gt(zero)).toBe(true);
    });
  });


  describe('getTokenAllowance', ()=>{

    test('should support btBUSD', async ()=>{
      const doubleForm = await Web3Common.getTokenAllowance(Assets.btBUSD, address, randomAddress);
      const absoluteForm = ethers.utils.parseUnits(doubleForm, Assets.btBUSD.decimals);
      expect(absoluteForm.eq(zero)).toBe(true);
    });

    test('should support atUSDC', async ()=>{
      const doubleForm = await Web3Common.getTokenAllowance(Assets.atUSDC, address, randomAddress);
      const absoluteForm = ethers.utils.parseUnits(doubleForm, Assets.atUSDC.decimals);
      expect(absoluteForm.eq(zero)).toBe(true);
    });

    test('should support pmUSDC', async ()=>{
      const doubleForm = await Web3Common.getTokenAllowance(Assets.pmUSDC, address, randomAddress);
      const absoluteForm = ethers.utils.parseUnits(doubleForm, Assets.pmUSDC.decimals);
      expect(absoluteForm.eq(zero)).toBe(true);
    });
  });

})


