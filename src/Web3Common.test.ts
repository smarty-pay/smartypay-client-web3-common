/*
  Smarty Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/

import { Web3Common } from './Web3Common';
import { Assets, util } from 'smartypay-client-model';
import { ethers } from 'ethers';

describe('Web3Common', () => {
  const address = '0x14186C8215985f33845722730c6382443Bf9EC65';
  const randomAddress = '0x790ACC251534cb02975A0c61dA94D200bB5833A5'; // from https://vanity-eth.tk/

  const zero = util.bigMath.toBigNumber(0);

  describe('toNumberFromHex', () => {
    test('should be correct number', () => {
      expect(Web3Common.toNumberFromHex('0x01')).toBe(1);
      expect(Web3Common.toNumberFromHex('0x0f')).toBe(15);
      expect(Web3Common.toNumberFromHex('0x0F')).toBe(15);
    });
  });

  describe('toHexString', () => {
    test('should be correct hex', () => {
      expect(Web3Common.toHexString(0)).toBe('0x0');
      expect(Web3Common.toHexString(1)).toBe('0x1');
      expect(Web3Common.toHexString(15)).toBe('0xf');
      expect(Web3Common.toHexString(16)).toBe('0x10');
      expect(Web3Common.toHexString(255)).toBe('0xff');
      expect(Web3Common.toHexString(256)).toBe('0x100');
    });
  });

  describe('jsonProvidersManager', () => {
    test('should use providers cache by default', async () => {
      expect(Web3Common.jsonProvidersManager.isUseCache()).toBe(true);
    });
  });

  describe('getTokenBalance', () => {
    test('should support btBUSD', async () => {
      const doubleForm = await Web3Common.getTokenBalance(Assets.btBUSD, address);
      const absoluteForm = ethers.parseUnits(doubleForm, Assets.btBUSD.decimals);
      expect(util.bigMath.isGreaterThan(absoluteForm, zero)).toBe(true);
    });

    test('should support btMNXe', async () => {
      const doubleForm = await Web3Common.getTokenBalance(Assets.btMNXe, address);
      const absoluteForm = ethers.parseUnits(doubleForm, Assets.btMNXe.decimals);
      expect(util.bigMath.isGreaterThan(absoluteForm, zero)).toBe(true);
    });

    test('should support btUSDTv2', async () => {
      const doubleForm = await Web3Common.getTokenBalance(Assets.btUSDTv2, address);
      const absoluteForm = ethers.parseUnits(doubleForm, Assets.btUSDTv2.decimals);
      expect(util.bigMath.isGreaterThan(absoluteForm, zero)).toBe(true);
    });

    test('should support asUSDC', async () => {
      const doubleForm = await Web3Common.getTokenBalance(Assets.asUSDC, address);
      const absoluteForm = ethers.parseUnits(doubleForm, Assets.asUSDC.decimals);
      expect(util.bigMath.isGreaterThan(absoluteForm, zero)).toBe(true);
    });

    test('should support asUSDT', async () => {
      const doubleForm = await Web3Common.getTokenBalance(Assets.asUSDT, address);
      const absoluteForm = ethers.parseUnits(doubleForm, Assets.asUSDT.decimals);
      expect(util.bigMath.isGreaterThan(absoluteForm, zero)).toBe(true);
    });

    test('should support paUSDC', async () => {
      const doubleForm = await Web3Common.getTokenBalance(Assets.paUSDC, address);
      const absoluteForm = ethers.parseUnits(doubleForm, Assets.paUSDC.decimals);
      expect(util.bigMath.isGreaterThan(absoluteForm, zero)).toBe(true);
    });

    test('should support paUSDT', async () => {
      const doubleForm = await Web3Common.getTokenBalance(Assets.paUSDT, address);
      const absoluteForm = ethers.parseUnits(doubleForm, Assets.paUSDT.decimals);
      expect(util.bigMath.isGreaterThan(absoluteForm, zero)).toBe(true);
    });

    test('should support sUSDC', async () => {
      const doubleForm = await Web3Common.getTokenBalance(Assets.sUSDC, address);
      const absoluteForm = ethers.parseUnits(doubleForm, Assets.sUSDC.decimals);
      expect(util.bigMath.isGreaterThan(absoluteForm, zero)).toBe(true);
    });
  });

  describe('getTokenAllowance', () => {
    test('should support btBUSD', async () => {
      const doubleForm = await Web3Common.getTokenAllowance(Assets.btBUSD, address, randomAddress);
      const absoluteForm = ethers.parseUnits(doubleForm, Assets.btBUSD.decimals);
      expect(util.bigMath.isEqualTo(absoluteForm, zero)).toBe(true);
    });

    test('should support atUSDC', async () => {
      const doubleForm = await Web3Common.getTokenAllowance(Assets.asUSDC, address, randomAddress);
      const absoluteForm = ethers.parseUnits(doubleForm, Assets.asUSDC.decimals);
      expect(util.bigMath.isEqualTo(absoluteForm, zero)).toBe(true);
    });

    test('should support paUSDC', async () => {
      const doubleForm = await Web3Common.getTokenAllowance(Assets.paUSDC, address, randomAddress);
      const absoluteForm = ethers.parseUnits(doubleForm, Assets.paUSDC.decimals);
      expect(util.bigMath.isEqualTo(absoluteForm, zero)).toBe(true);
    });
  });
});
