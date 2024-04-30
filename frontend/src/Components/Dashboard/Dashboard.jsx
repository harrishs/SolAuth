import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { useState } from "react";
import { toast } from "react-toastify";

const Dashboard = () => {
	const { connection } = useConnection();
	const { publicKey, sendTransaction } = useWallet();
	const [balance, setBalance] = useState(0);
	const [txnSig, setTxnSig] = useState("");
	const [acct, setAcct] = useState("");
	const [amount, setAmount] = useState(0);

	useEffect(() => {
		const getInfo = async () => {
			if (connection && publicKey) {
				const info = await connection.getAccountInfo(publicKey);
				setBalance(info.lamports / web3.LAMPORTS_PER_SOL);
			} else {
				setBalance(null);
			}
		};
		getInfo();
	}, [connection, publicKey, balance]);

	//Code for Solana Faucet
	const fundWallet = async (event) => {
		if (!publicKey || !connection) {
			toast.error("Wallet not connected");
			return;
		}

		const sender = web3.Keypair.generate();

		await connection.requestAirdrop(
			sender.publicKey,
			web3.LAMPORTS_PER_SOL * 1
		);

		const transaction = new web3.Transaction().add(
			web3.SystemProgram.transfer({
				fromPubkey: sender.publicKey,
				toPubkey: publicKey,
				lamports: web3.LAMPORTS_PER_SOL * 1,
			})
		);

		try {
			const signature = await sendTransaction(transaction, connection, {
				signers: [sender],
			});
			setTxnSig(signature);
		} catch (error) {
			toast.error("Transaction failed");
		}
	};
	//End of Code for Solana Faucet

	//Code for sending Solana
	const handleTxn = async () => {
		if (!publicKey || !connection) {
			toast.error("Wallet not connected");
			return;
		}

		const transaction = new web3.Transaction();
		const instruction = web3.SystemProgram.transfer({
			fromPubkey: publicKey,
			lamports: web3.LAMPORTS_PER_SOL * amount,
			toPubkey: acct,
		});

		transaction.add(instruction);

		try {
			const signature = await sendTransaction(transaction, connection);
			setTxnSig(signature);

			const newBalance = balance - amount;
			setBalance(newBalance);
		} catch (error) {
			toast.error("Transaction failed");
		}
	};

	return (
		<>
			<h1>Dashboard</h1>
			<p>Wallet: {publicKey?.toBase58()}</p>
			<p>Balance: {balance} SOL</p>
			<button onClick={fundWallet}>Airdrop 1 Sol</button>
			<input
				type="text"
				placeholder="Address of Reciever"
				onChange={(event) => setAcct(event.target.value)}
			/>
			<input
				type="number"
				min={0}
				placeholder="Amount of Sol to Send"
				onChange={(event) => setAmount(event.target.value)}
			/>
			<button onClick={handleTxn}>Send Sol</button>
			<p>
				Link to Txn:{" "}
				{txnSig ? (
					<a
						href={`https://explorer.solana.com/tx/${txnSig}?cluster=devnet`}
						target="_blank"
					>
						{txnSig}
					</a>
				) : (
					"No transaction yet"
				)}
			</p>
		</>
	);
};

export default Dashboard;
