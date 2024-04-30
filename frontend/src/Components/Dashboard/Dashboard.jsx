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
	}, [connection, publicKey]);

	const fundWallet = async (event) => {
		event.preventDefault();

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

	return (
		<>
			<h1>Dashboard</h1>
			<p>Wallet: {publicKey?.toBase58()}</p>
			<p>Balance: {balance} SOL</p>
			<form onSubmit={(event) => fundWallet(event)}>
				<button type="submit">Airdrop 1 Sol</button>
			</form>
			<p>
				Link to Txn:{" "}
				{txnSig
					? `https://explorer.solana.com/tx/${txnSig}?cluster=devnet`
					: "No transaction yet"}
			</p>
		</>
	);
};

export default Dashboard;
