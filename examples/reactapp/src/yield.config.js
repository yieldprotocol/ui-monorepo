import {ethers} from 'ethers';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  // defaultProvider: new ethers.providers.WebSocketProvider('wss://mainnet.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea'),
  defaultChainId: 5,
  ignoreSeries: [ '0x303230340000', '0x303130340000'],
  useFork: true,
};
