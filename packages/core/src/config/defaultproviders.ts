import { ethers } from 'ethers';
declare const window: any;

export const defaultAccountProvider = new ethers.providers.Web3Provider(window.ethereum);

export const defaultProviderMap: Map<number, ethers.providers.BaseProvider> = new Map([
  [1, new ethers.providers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea` ) ],
  [5, new ethers.providers.WebSocketProvider( `wss://goerli.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea` ) ], 
  [42161, new ethers.providers.AlchemyProvider(42161, 'vtMM4_eLnOvkjkdckprVw3cIa64EVkDZ') as ethers.providers.BaseProvider ]
]);

export const forkProviderMap: Map<number, ethers.providers.BaseProvider> = new Map([
  [1, new ethers.providers.JsonRpcProvider(`https://rpc.tenderly.co/fork/935740ae-abd2-41c3-bda7-d03f8b102c29` ) ],
]);
