/*
  SMARTy Pay Client Web3 Common
  @author Evgeny Dolganov <evgenij.dolganov@gmail.com>
*/

import { BrowserProvider, ethers } from 'ethers';
import { abi, Assets, Blockchains, util } from 'smartypay-client-model';

import { UseLogs } from './util';
import { JsonProvidersManager } from './util/JsonProvidersManager';

import type { TxReqProp } from './types';
import type { Web3Api } from './web3-api';
import type { BigNumberish } from 'ethers';
import type { Currency, Network, Token } from 'smartypay-client-model';

const DefaultTxConfirms = 1;

let lazyCache: util.SimpleTtlCache<string, string>;

function getLazyCache() {
  if (!lazyCache) {
    lazyCache = new util.SimpleTtlCache<string, string>();
  }
  return lazyCache;
}

interface GetTokenBalanceOpt {
  cacheTtl?: number;
}

/**
 * Common API for all blockchains and wallets
 */
export const Web3Common = {
  ...UseLogs,

  jsonProvidersManager: JsonProvidersManager,

  async getTokenBalance(token: Token, ownerAddress: string, opt?: GetTokenBalanceOpt): Promise<string> {
    const { network, tokenId, decimals } = token;
    const cacheKey = `Web3Common_getTokenBalance_${ownerAddress}_${tokenId})`;

    // multi-same calls will wait for a single result
    return await util.withSingleCall(cacheKey, async () => {
      const cache = getLazyCache();
      const cached = cache.get(cacheKey);

      // no real call
      if (cached) {
        return cached;
      }

      // readonly methods can be called without wallet
      const { rpc } = Blockchains[network];
      const provider = JsonProvidersManager.getProvider(rpc);

      const contract = new ethers.Contract(tokenId, abi.Erc20ABI, provider);
      const balance: BigNumberish = await contract.balanceOf(ownerAddress);
      const out = ethers.formatUnits(balance, decimals);

      // save to cache if needed
      if (opt?.cacheTtl && opt.cacheTtl > 0) {
        cache.set(cacheKey, out, opt.cacheTtl);
      }

      return out;
    });
  },

  async getTokenAllowance(token: Token, ownerAddress: string, spenderAddress: string): Promise<string> {
    const { network, tokenId, decimals } = token;
    const { rpc } = Blockchains[network];

    // readonly methods can be called without wallet
    const provider = JsonProvidersManager.getProvider(rpc);

    const contract = new ethers.Contract(tokenId, abi.Erc20ABI, provider);
    const allowance: BigNumberish = await contract.allowance(ownerAddress, spenderAddress);
    return ethers.formatUnits(allowance, decimals);
  },

  async getContractForWallet(web3Api: Web3Api, contractAddress: string, abiDef: any) {
    const provider = new BrowserProvider(web3Api.getRawProvider() as any);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, abiDef, signer);
  },

  async walletTokenApprove(
    web3Api: Web3Api,
    token: Token,
    ownerAddress: string,
    spenderAddress: string,
    approveAbsoluteAmount: string,
    prop?: TxReqProp,
  ): Promise<string> {
    await Web3Common.switchWalletToAssetNetwork(web3Api, token);

    const { tokenId } = token;

    const provider = new BrowserProvider(web3Api.getRawProvider() as any);
    const signer = await provider.getSigner(ownerAddress);
    const contract = new ethers.Contract(tokenId, abi.Erc20ABI, signer);

    // call tx
    const txResp = await contract.approve(spenderAddress, approveAbsoluteAmount);
    const { hash } = await txResp.wait(prop?.waitConfirms ?? DefaultTxConfirms);
    return hash;
  },

  async switchWalletToAssetNetwork(web3Api: Web3Api, token: Token) {
    await Web3Common.switchWalletToNetwork(web3Api, token.network);
  },

  async switchWalletToNetwork(web3Api: Web3Api, network: Network) {
    const { chainId, chainIdHex, chainName, native, rpc, explorer } = Blockchains[network];

    const walletChainId = await web3Api.getChainId();
    if (walletChainId === chainId) {
      return;
    }

    if (UseLogs.useLogs()) {
      console.log('switch wallet network', { from: walletChainId, to: chainId });
    }

    const provider = web3Api.getRawProvider();

    // try to switch to existing network in wallet:
    try {
      const result = await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: chainIdHex,
          },
        ],
      });

      // success
      if (UseLogs.useLogs()) {
        console.log('wallet switch to existing network result', result);
      }
      return;
    } catch (e: any) {
      const msg: string = e.message || e.toString() || '';

      // no need to continue
      if (msg.toLowerCase().includes('user rejected')) {
        throw e;
      }
    }

    // next: try to add network to wallet:
    const result = await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: chainIdHex,
          chainName,
          nativeCurrency: {
            name: native,
            symbol: native,
            decimals: 18,
          },
          rpcUrls: [rpc],
          blockExplorerUrls: [explorer],
        },
      ],
    });

    if (UseLogs.useLogs()) {
      console.log('wallet switch network result', result);
    }
  },

  async addCurrencyTokenToWallet(web3Api: Web3Api, currency: Currency) {
    const token = (Assets as any)[currency] as Token | undefined;
    if (token) {
      await this.addTokenToWallet(web3Api, token);
    } else if (UseLogs.useLogs()) {
      console.log('cannot add unknown token', currency);
    }
  },

  async addTokenToWallet(web3Api: Web3Api, token: Token) {
    // need to use target network first
    await Web3Common.switchWalletToNetwork(web3Api, token.network);

    const provider = web3Api.getRawProvider();

    try {
      await provider.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: token.tokenId,
            symbol: token.abbr,
            decimals: token.decimals,
          },
        } as any,
      });

      if (UseLogs.useLogs()) {
        console.log('added token', token.abbr);
      }
    } catch (e: any) {
      if (UseLogs.useLogs()) {
        console.log('cannot add token', e.message || e.toString());
      }
    }
  },

  /**
   * See chars registers:
   * <pre>
   * "0x14186c8215985f33845722730c6382443bf9ec65"
   * ->
   * "0x14186C8215985f33845722730c6382443Bf9EC65"
   * </pre>
   */
  getNormalAddress(address: string): string {
    return ethers.getAddress(address);
  },

  toAbsoluteForm(amount: string, token: Token): string {
    return ethers.parseUnits(amount, token.decimals).toString();
  },

  toBigNumber(value: any) {
    return util.bigMath.toBigNumber(value);
  },

  toDecimalForm(amount: any, token: Token): string {
    return ethers.formatUnits(amount, token.decimals);
  },

  toHexString(value: any): string {
    return util.hex.toHexString(value);
  },

  toNumberFromHex(value: string): number {
    return util.hex.toNumberFromHex(value);
  },
};
