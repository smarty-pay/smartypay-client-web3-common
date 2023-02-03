import {ethers} from 'ethers';

let useCache = true;
const cache = new Map<string, ethers.providers.JsonRpcProvider>();

export const JsonProvidersManager = {

  getProvider(rpc: string): ethers.providers.JsonRpcProvider {

    // from cache
    const fromCache = useCache? cache.get(rpc) : undefined;
    if(fromCache)
      return fromCache;

    // new
    const provider = new ethers.providers.JsonRpcProvider(rpc);

    // store in cache if needed
    if(useCache){
      cache.set(rpc, provider);
    }

    return provider;
  },

  isUseCache(){
    return useCache;
  },

  setUseCache(value: boolean){
    useCache = value;
    if( ! useCache){
      JsonProvidersManager.clearProvidersCache();
    }
  },

  clearProvidersCache(){
    cache.clear();
  }
}