import axios from 'axios';

interface Mint {
  chainId: number;
  address: string;
  programId: string;
  logoURI: string;
  symbol: string;
  name: string;
  decimals: number;
  tags: string[];
  extensions: Record<string, unknown>;
}

interface PoolData {
  type: string;
  programId: string;
  id: string;
  mintA: Mint;
  mintB: Mint;
  price: number;
  mintAmountA: number;
  mintAmountB: number;
  feeRate: number;
  openTime: string;
  tvl: number;
  day: Record<string, unknown>;
  week: Record<string, unknown>;
  month: Record<string, unknown>;
  pooltype: string[];
  rewardDefaultInfos: unknown[];
  farmUpcomingCount: number;
  farmOngoingCount: number;
  farmFinishedCount: number;
  marketId: string;
  lpMint: Mint;
  lpPrice: number;
  lpAmount: number;
}

interface PoolResponse {
  id: string;
  success: boolean;
  data: {
    count: number;
    data: PoolData[];
    hasNextPage: boolean;
  };
}

export interface TokenInfo extends Mint {
  pool: string;
}

const SOL: string = 'So11111111111111111111111111111111111111112';

let lastToken: string | null = null;
let lastInfo: TokenInfo | null = null;

export async function getTokenInfo(mint: string): Promise<TokenInfo | null> {
  if (lastToken === mint) {
    return lastInfo;
  }

  console.log('getTokenInfo', mint);

  try {
    const infoResponse = await axios.get<PoolResponse>(
      'https://api-v3.raydium.io/pools/info/mint',
      {
        params: {
          mint1: SOL,
          mint2: mint,
          poolType: 'standard',
          poolSortField: 'default',
          sortType: 'desc',
          pageSize: 1,
          page: 1
        }
      }
    );

    const data = infoResponse.data.data.data;
    if (data.length === 0) {
      throw new Error('No info found for the given token mint address.');
    }

    console.log('TOKEN INFO', JSON.stringify(data, null, 2));

    const poolInfo = data[0];
    const token = ['SOL', 'WSOL'].includes(poolInfo.mintA.symbol) ? poolInfo.mintB : poolInfo.mintA;
    const info = {
      pool: poolInfo.id,
      ...token
    };

    lastInfo = info;
    lastToken = mint;

    return info;
  } catch (error) {
    console.error('Error fetching SOL pair ID:', error);
    return null;
  }
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export function storeItem(key: string, value: any): void {
  if (value === null || value === undefined) {
    localStorage.removeItem(key);
  } else if (typeof value === 'string') {
    localStorage.setItem(key, value);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export function fetchItem(key: string): any {
  const value = localStorage.getItem(key);
  if (value === null) {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}
