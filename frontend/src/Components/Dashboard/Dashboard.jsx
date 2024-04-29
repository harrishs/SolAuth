import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { useState } from "react";

const Dashboard = () => {
	const { connection } = useConnection();
	const { publicKey } = useWallet();
	const [balance, setBalance] = useState(0);

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

	return (
		<>
			<h1>Dashboard</h1>
			<p>Wallet: {publicKey?.toBase58()}</p>
			<p>Balance: {balance} SOL</p>
		</>
	);
};

export default Dashboard;
