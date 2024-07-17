import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, VersionedTransaction } from '@solana/web3.js';
import { getAccount, getAssociatedTokenAddressSync, getMint } from '@solana/spl-token';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const SOL = 'So11111111111111111111111111111111111111112';
const RPC = 'https://fragrant-green-tab.solana-mainnet.quiknode.pro/9562d9127f7a75d7ab3e3be61c85c78bdac7ccfa/';
const connection = new Connection(RPC);

// AyBgKL9XZa5FRehypY7tMzhhjcGJJZ3sHj13eA3Tu2Xm
const walletPath = path.resolve('.secure/wallet.json');
const wallet = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(walletPath, 'utf8'))));
console.log('wallet', walletPath);

function getTokenAddress(token: string, owner: PublicKey): PublicKey {
    const address = getAssociatedTokenAddressSync(new PublicKey(token), owner);
    return address;
}

async function getTokenBalance(token: string, owner: PublicKey): Promise<number> {
    const address = getTokenAddress(token, owner);
    try {
        const account = await getAccount(connection, address);
        const mint = await getMint(connection, account.mint);
        return Number(account.amount) / (10 ** mint.decimals);
    }
    catch (e) {
        // getAccount will error if token never held
        return 0;
    }
}

// https://station.jup.ag/docs/apis/swap-api#v6-api-reference
async function buyToken(inputMint: string, outputMint: string, amount: number, payer: Keypair, slippageBps: number = 500): Promise<void> {
    // get quote for swap
    const quoteResponse = await axios.get('https://quote-api.jup.ag/v6/quote', {
        params: {
            inputMint,
            outputMint,
            amount,
            slippageBps
        }
    }).then(response => response.data);

    // get serialized transaction for the swap
    // see https://station.jup.ag/docs/apis/troubleshooting#transaction-confirmation-timeout
    const { swapTransaction } = await axios.post('https://quote-api.jup.ag/v6/swap', {
        quoteResponse,
        userPublicKey: payer.publicKey.toString(),
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: { autoMultiplier: 5 }
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.data);

    // deserialize the transaction
    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    // sign, send and confirm
    transaction.sign([payer]);
    await sendAndConfirmTransaction(transaction);
}

// https://station.jup.ag/docs/limit-order/limit-order-api
async function createLimitOrder(inputMint: string, outputMint: string, inAmount: number, outAmount: number, payer: Keypair): Promise<void> {
    // base key is used to generate a unique order id
    const base = Keypair.generate();

    // get serialized transaction for the order
    const { tx } = await axios.post('https://jup.ag/api/limit/v1/createOrder', {
        owner: payer.publicKey.toString(),
        inAmount,
        outAmount,
        inputMint,
        outputMint,
        expiredAt: null, // new Date().valueOf() / 1000,
        base: base.publicKey.toString(),
        // https://station.jup.ag/docs/apis/adding-fees
        // referralAccount: referral.publicKey.toString(),
        // referralName: "Referral Name"
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.data);

    // deserialize the transaction
    const transactionBuf = Buffer.from(tx, 'base64');
    const transaction = VersionedTransaction.deserialize(transactionBuf);

    // sign, send and confirm
    transaction.sign([payer, base]);
    await sendAndConfirmTransaction(transaction);
}

async function sendAndConfirmTransaction(transaction: VersionedTransaction): Promise<void> {
    const { lastValidBlockHeight, blockhash } = await connection.getLatestBlockhash();
    const signature = await connection.sendTransaction(transaction, { maxRetries: 5 });
    const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
    }, 'finalized');

    if (confirmation.value.err) {
        throw new Error(`❌ Transaction not confirmed - ${confirmation.value.err}`);
    }
    console.log(`✅ https://solscan.io/tx/${signature}`);
}

(async () => {
    const amountSOL = 0.01;
    // const token = 'USAaizaW8YVRF47xu5HqgXk6zJNNEN9gFuztyhDXqLm';
    const token = 'DPc5aw1FEg71LuKU52RFehWmj38xFCNJ1VkJejbcqD8T';

    try {
        console.log('getting previous balance');
        const previous = await getTokenBalance(token, wallet.publicKey);
        console.log('previous', previous);

        console.log('buying token');
        await buyToken(SOL, token, amountSOL * LAMPORTS_PER_SOL, wallet);

        console.log('getting current balance');
        const current = await getTokenBalance(token, wallet.publicKey);
        console.log('current', current);

        const bought = current - previous;
        console.log('bought', bought);

    } catch (error) {
        console.error('Error:', error);
    }
})();
