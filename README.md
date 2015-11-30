msc
===========================

Small package to master-slave balance of background task.

Install with:

    npm install msc


You can watch, how it works. Just run `node check/runner.js` on directory with lib.
Then look to console and try kill, start workers.

## Usage

Simple example:

```js

    var Msc = require('msc');
    var msc = new Msc({port: 8000, interval: 100, algorithm: 'aes128', key: 'adfhjewhrewkdf'});

    msc.isMaster() // true if is master

```


# Methods

## new Msc()

If `algorithm !== 'no'` and no key passed to constructor - throws error (EmptyKeyError).

* `key`: key to crypt strings (can use without key with `'no'` `.algorithm`).
* `algorithm`: which algorithm use to encrypt messages. Default `aes128`.
* `headerEncrypted`: `true` if header should encrypted. Default `false`.
* `port`: port to listen by socket server. Default `8778`.
* `startTime`: time then application was started in ms. Default `Date.now()`.
* `interval` : interval of checking other clients in ms. Default `100`.
* `waitTimeout` : timeout of checking answer wait in ms. Default `interval * 3`.
* `uid`: some intentifier of app. Default `String(Math.random())`.
* `logger`: Logger to log inner events. Default do not log anything.
* `keys`: Array. Keys to check master by key (can differ from `isMaster()` answer). See below.

 

## msc.onError(cb) 

If some server or client return error - will spawn this callback.

Parameters:

 Name     | Type     | Description
----------|----------|------------------
`cb`      |	Function | callback on error 	


## msc.start()

Start server, connect clients and try rebalance cluster.

## msc.stop()

Stop server, disconnect clients.

## msc.addServer(id, config)

Add some server to cluster to balance it.

Parameters:

 Name     | Type             | Description
----------|------------------|------------------
`id`      |	String or Number | id of server to connect 	
`config`  | Object           | config of server to connect


`config` should include:
* `port` to connect.
* `host` to connect.
* `algorithm` to encrypt if need. Default `'no'`.
* `key` to encrypt. Default `undefined`.

## msc.removeServer(id)

Remove server from cluster by it id.

## msc.addKey(key)

Add key to balance in cluster. Start rebalance cluster by this key.

Parameters:

 Name         | Type                 | Description
--------------|----------------------|-------------
`key`         | String |

## msc.removeKey(key)
Remove key to balance in cluster. Start rebalance cluster by this key.

Parameters:

 Name       	| Type   | Description
--------------|--------|------------
`key`	        | String | 	


## msc.isMaster()

Return `true` if is master in this cluster. Else return `false`.
At the time of main rebalance - every unit will return `true`.
Rebalance time depends from `interval` arg of constructor.


## msc.isMasterByKey(key)

Check, if this unit is master by this key (every unit can has different keys)
Can differ with `.isMaster()` answer.
At the time of main rebalance - every unit with such key will return `true`.
At the time of this key rebalance - every unit with suck key will return `true`.
**Warning!** Return `false` if you did not `.addKey(key)` on this unit.

Parameters:

 Name 	   | Type     | Description
-----------|----------|------------------
`key`      | String   |
 	
 	
## msc.doIfMaster(cb)

Spawn cb if is master. Else - wait timeout (msc.waitTimeout * 2) and try again.
If now is master - spawn cb. Else do nothing. All callbacks will spawn in order, 
they put into this function.

Parameters:

 Name 	   | Type     | Description
-----------|----------|------------------
`cb`       | Function |
 	

## msc.doIfMasterByKey(key, cb)

Spawn cb if is master by key. Else - wait timeout (msc.waitTimeout * 2) and try again.
If now is master - spawn cb. Else do nothing. All callbacks will spawn in order, 
they put into this function.

Parameters:

 Name 	   | Type     | Description
-----------|----------|------------------
`key`      | String   |
`cb`       | Function |

 	

## msc.update([key])

If key is specified - start rebalance in unit by key. Else - start rebalance on unit by all keys and main rebalance on it.

Parameters:

 Name  	  | Type   |	Description
----------|--------|--------------------
`key`     | String | Optional


# LICENSE - "MIT License"

Copyright (c) 2015 Konstantine Petryaev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.