import {
  Connection,
  Keypair,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Buffer } from "buffer";
// Create the functionality for the button titled “Create a new Solana account” that generates a new KeyPair at the backend and airdrops 2 SOL to the newly created Keypair.
// Once this step is completed, create the functionality for the next button that says - “Connect to Phantom Wallet”, which should connect to the Phantom Wallet if it exists.
// Once this step is completed, create the final functionality for a button called “Transfer SOL to New Wallet”. This button should trigger a transfer of 1 SOL (airdropped into the account you generated in step 1) to the account connected in Step 2.
function App() {
  window.Buffer = Buffer;
  const [Toadd, setToadd] = useState("");
  const [Fromadd, setFromadd] = useState("");
  const [keypair, setkeypair] = useState(null);
  const [connection, setConnection] = useState(null);

  // “Connect to Phantom Wallet”

  const ConnectWallet = async () => {
    const { solana } = window;
    if (solana) {
      try {
        const response = await solana.connect();
        console.log(response.publicKey.toString());
        setToadd(response.publicKey.toString());
      } catch (err) {
        console.error(err);
      }
    }
  };

  // “Transfer SOL to New Wallet”
  const Transfer = async () => {
    console.log("Transfer method invoked");

    try {
      if (!keypair || !connection) {
        console.error("Keypair or connection not initialized");
        return;
      }

      console.log("trying.....");
      const transaction = new Transaction();
      const instruction = SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: new PublicKey(Toadd),
        lamports: 1 * LAMPORTS_PER_SOL,
      });
      transaction.add(instruction);

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair]
      );
      console.log("Transaction is successfull");
      console.log("Transaction Signature:", signature);
    } catch (err) {
      console.error(err);
    }
  };

  // “Create a new Solana account”
  const CreateKeyPair = async () => {
    const newKeypair = Keypair.generate();
    setkeypair(newKeypair);
    const pubkey = newKeypair.publicKey.toString();
    console.log("PublicKey :", pubkey);
    setFromadd(pubkey);
    const newConnection = new Connection("http://127.0.0.1:8899", "confirmed");
    setConnection(newConnection);

    try {
      let airdropSignature = await newConnection.requestAirdrop(
        newKeypair.publicKey,
        2 * LAMPORTS_PER_SOL
      );

      await newConnection.confirmTransaction(airdropSignature);

      console.log("Airdropped 2 SOL");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div class="d-flex flex-column mb-3">
        <label className="p-3 m-3">
          <span>Step 1:</span>
          <button className="btn btn-primary m-4" onClick={ConnectWallet}>
            {Toadd != "" ? Toadd : "Connect to Phantom Wallet"}
          </button>
        </label>
        <label className="p-3 m-3">
          <span>Step 2:</span>
          <button
            type="button"
            className="btn btn-secondary m-4"
            onClick={CreateKeyPair}
          >
            Create a new Solana account
          </button>
        </label>
        <label className="p-3 m-3">
          <span>Step 3 : </span>
          <button
            type="button"
            className="btn btn-success m-4"
            onClick={Transfer}
          >
            Transfer SOL from created Wallet to Phantom Connected Wallet
          </button>
        </label>
      </div>
    </>
  );
}

export default App;
