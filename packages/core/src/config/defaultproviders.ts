import { ethers } from 'ethers';
declare const window: any;

export const defaultAccountProvider = new ethers.providers.Web3Provider(window.ethereum);

export const defaultProviderMap: Map<number, ethers.providers.BaseProvider> = new Map([
  [1, new ethers.providers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea` ) ],
  [5, new ethers.providers.WebSocketProvider( `wss://goerli.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea` ) ], 
  [42161, new ethers.providers.AlchemyProvider(42161, 'vtMM4_eLnOvkjkdckprVw3cIa64EVkDZ') as ethers.providers.BaseProvider ]
]);

export const defaultForkMap: Map<number, ethers.providers.BaseProvider> = new Map([
  [1, new ethers.providers.JsonRpcProvider() ],
  [1337, new ethers.providers.JsonRpcProvider() ],
]);

// hardhat node> https://mainnet.infura.io/v3/2af222f674024a0f84b5f0aad0da72a2
