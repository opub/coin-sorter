import { Connection, Keypair, VersionedTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import axios from 'axios';
import { Wallet } from '@project-serum/anchor';
import fs from 'fs';
import path from 'path';

const walletPath = path.resolve('.secure/wallet.json');
console.log('wallet', walletPath);
// AyBgKL9XZa5FRehypY7tMzhhjcGJJZ3sHj13eA3Tu2Xm
const wallet = new Wallet(Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(walletPath, 'utf8')))));

const RPC = 'https://fragrant-green-tab.solana-mainnet.quiknode.pro/9562d9127f7a75d7ab3e3be61c85c78bdac7ccfa/';
const connection = new Connection(RPC);

// https://station.jup.ag/docs/apis/swap-api#v6-api-reference
async function buyToken(amountSOL: number, token: string) {

    const quoteResponse = await axios.get('https://quote-api.jup.ag/v6/quote', {
        params: {
            inputMint: 'So11111111111111111111111111111111111111112',
            outputMint: token,
            amount: LAMPORTS_PER_SOL * amountSOL,
            slippageBps: 500 // 5%
        }
    }).then(response => response.data);
    console.log('quoteResponse', quoteResponse);

    // get serialized transactions for the swap
    const { swapTransaction } = await axios.post('https://quote-api.jup.ag/v6/swap', {
        quoteResponse,
        userPublicKey: wallet.publicKey.toString(),
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true, // allow dynamic compute limit instead of max 1,400,000
        prioritizationFeeLamports: 'auto' // or custom lamports: 1000

    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.data);
    console.log('swapTransaction', swapTransaction);

    // deserialize the transaction
    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    console.log('transaction', transaction);

    // sign the transaction
    transaction.sign([wallet.payer]);

    const { lastValidBlockHeight, blockhash } = await connection.getLatestBlockhash();

    const signature = await connection.sendTransaction(transaction, { maxRetries: 5 });

    const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
    }, 'confirmed');

    if (confirmation.value.err) {
        throw new Error(`❌ Transaction not confirmed - ${confirmation.value.err}`);
    }
    console.log('🎉 Transaction Succesfully Confirmed!', '\n', `https://solscan.io/tx/${signature}`);
}

(async () => {
    const amountSOL = 0.01; // Amount of SOL to swap
    const token = 'USAaizaW8YVRF47xu5HqgXk6zJNNEN9gFuztyhDXqLm'; // Replace with the actual token mint address

    try {
        console.log('buying token');
        await buyToken(amountSOL, token);
    } catch (error) {
        console.error('Error:', error);
    }
})();
