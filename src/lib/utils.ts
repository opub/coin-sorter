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

export const getTokenInfo = async (mint: string): Promise<TokenInfo | null> => {
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

    const poolInfo = data[0];

    const info = {
      pool: poolInfo.id,
      ...poolInfo.mintB
    };

    return info;
  } catch (error) {
    console.error('Error fetching SOL pair ID:', error);
    return null;
  }
};
