import {ethers} from 'ethers';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  // defaultProvider: new ethers.providers.WebSocketProvider('wss://mainnet.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea'),
  defaultChainId: 5,
  ignoreSeries: [ '0x303230340000', '0x303130340000'],
  // useFork: true,
  defaultForkMap : new Map([
    [1, new ethers.providers.JsonRpcProvider('https://rpc.tenderly.co/fork/f8730f17-bd41-41ff-bd59-2f1be4a144f1') ],
  ]),
  suppressEventLogQueries: false,
};
