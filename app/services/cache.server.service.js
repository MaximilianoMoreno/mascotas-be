(function () {
  'use strict';
  
  const NodeCache = require('node-cache');
  
  class Cache {
    constructor(ttlSeconds) {
      if (!Cache.instance) {
        this.cache = new NodeCache({stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false});
        Cache.instance = this;
      }
      
      return Cache.instance;
    }
    
    get(key, getFunction) {
      const value = this.cache.get(key);
      if (value) {
        return Promise.resolve(value);
      }
      
      return getFunction().then((result) => {
        this.cache.set(key, result);
        return result;
      });
    }
  
    clearCache(){
      this.cache.flushAll();
    }
  }
  
  const ttl = 30 * 60 * 1; // cache for 30 minutes
  const instance = new Cache(ttl);
  Object.freeze(instance);
  
  module.exports = instance;
  
})();
