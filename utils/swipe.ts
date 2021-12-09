import axios from "axios";
import {
  Address,
  Bip32,
  Bn,
  KeyPair,
  PrivKey,
  PubKey,
  Script,
  Tx,
  TxBuilder,
} from "bsv";

export async function swipe(
  network: "main" | "test",
  privateKeyOfSourceAddress: string,
  destinationAddressString: string
): Promise<Tx> {
  const PrivKeyType = network === "main" ? PrivKey.Mainnet : PrivKey.Testnet;
  const AddressType = network === "main" ? Address.Mainnet : Address.Testnet;
  const KeyPairType = network === "main" ? KeyPair.Mainnet : KeyPair.Testnet;
  const Bip32Type = network === "main" ? Bip32.Mainnet : Bip32.Testnet;

  const from = PrivKeyType.fromString(privateKeyOfSourceAddress);
  const to = AddressType.fromString(destinationAddressString);
  const fromPub = PubKey.fromPrivKey(from);
  const fromAddr = AddressType.fromPrivKey(from);

  // Collecting Data
  console.log("Querying UTXO list of address...");
  const utxosUrl = `https://api.whatsonchain.com/v1/bsv/${network}/address/${fromAddr.toString()}/unspent`;
  const utxos = (await axios.get<WhatsOnChainUtxoData[]>(utxosUrl)).data;
  console.log("Querying TX list of UTXOs...");
  const rawsUrl = `https://api.whatsonchain.com/v1/bsv/${network}/txs/hex`;
  const raws = (
    await axios.post<WhatsOnChainBulkRawTxData[]>(
      rawsUrl,
      { txids: utxos.map((i) => i.tx_hash) },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
  ).data;

  const txs = raws.map((raw) => Tx.fromHex(raw.hex));
  const outs = txs.map((tx, i) => tx.txOuts[utxos[i].tx_pos]);

  // Constructing the Transaction
  const txb = new TxBuilder();
  for (let i = 0; i < utxos.length; i++) {
    txb.inputFromPubKeyHash(txs[i].hash(), utxos[i].tx_pos, outs[i], fromPub);
  }
  txb.setChangeAddress(to);
  txb.build({ useAllInputs: true });
  txb.signWithKeyPairs([KeyPairType.fromPrivKey(from)]);
  return txb.tx;
}

type WhatsOnChainUtxoData = {
  height: number;
  tx_pos: number;
  tx_hash: string;
  value: number;
};

type WhatsOnChainBulkRawTxData = {
  txid: string;
  hex: string;
  blockhash: string;
  blockheight: number;
  blocktime: number;
  confirmations: number;
};
