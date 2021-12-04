import { Address, Bn, KeyPair, PrivKey, PubKey, Script, Tx, TxBuilder, TxOut, VarInt } from "bsv";

export function makeTxToAddress(address: string, satoshis: string, changeAddress: string) : Tx {
    const txBuilder = new TxBuilder();
    txBuilder.outputToAddress(new Bn(satoshis, 10), Address.fromString(address));
    txBuilder.setChangeAddress(Address.fromString(changeAddress))

    const tx = addSignedInputToTxBuilder(txBuilder)
    return tx;
}

export function makeDataTx(data: Buffer, changeAddress: string) : Tx {
    const txBuilder = new TxBuilder();
    txBuilder.outputToScript(new Bn('0', 10), Script.fromSafeData(data))
    txBuilder.setChangeAddress(Address.fromString(changeAddress))

    const tx = addSignedInputToTxBuilder(txBuilder)
    return tx;
}

export function makeTxWithDataAndSendToAddress(data: Buffer, address: string, satoshis: string, changeAddress: string) : Tx {
    const txBuilder = new TxBuilder();
    txBuilder.outputToScript(new Bn('0', 10), Script.fromSafeData(data))
    txBuilder.outputToAddress(new Bn(satoshis, 10), Address.fromString(address));
    txBuilder.setChangeAddress(Address.fromString(changeAddress))

    const tx = addSignedInputToTxBuilder(txBuilder)
    return tx;
}

function addSignedInputToTxBuilder(txBuilder: TxBuilder) : Tx {
    const inputData = constructFakeInput()

    // this is giving the builder information about the source of the funds being spent.
    txBuilder.inputFromPubKeyHash(
        Buffer.from(inputData.publicDataAboutPrevTxOut.transactionId, 'hex'), // it's important to not forget to specify if data is "hex"
        inputData.publicDataAboutPrevTxOut.outputIndex,
        new TxOut(
            new Bn(inputData.publicDataAboutPrevTxOut.valueInSatoshis, 10),
            VarInt.fromNumber(Buffer.from(inputData.publicDataAboutPrevTxOut.lockingScript, "hex").length), // this is just the size of the script
            Script.fromHex(inputData.publicDataAboutPrevTxOut.lockingScript)
        ),
        PubKey.fromString(inputData.knowledgeAboutPrevTxOut.publicKey),
    )

    // this is needed before signing. It parses previous data given to the TX Builder.
    txBuilder.build()

    // This will look for inputs of type P2PKH and sign them with the given Public & Private Keys.
    // It is by far the simplest way to sign inputs, but it only works with the P2PKH type.
    // If you ever want to sign a different type of input, use the "txBuilder.signTxIn" function.
    txBuilder.signWithKeyPairs([ KeyPair.fromPrivKey(PrivKey.fromString(inputData.knowledgeAboutPrevTxOut.privateKey)) ])

    return txBuilder.tx
}


function constructFakeInput() : FakeTxOutData {
    // NOTE:
    //   THIS DATA IS FAKE!
    //   THERE IS NO SUCH INPUT!
    //   TRANSACTIONS CREATED WITH IT WILL BE INVALID ON THE BLOCKCHAIN !!!

    return {
            publicDataAboutPrevTxOut: {
                transactionId: 'e7680a880aa1864402ac3a648625e5c26b72c52138e53a6b8b02a74e077096f4',
                outputIndex: 2,
                valueInSatoshis: "200000000", // that's 2 bitcoins.
                // We're using Strings for some numbers, because the 'number' type in JS has a limit, so it doesn't let us do big number operations.
                // The "Bn" class from the 'bsv' library works with strings or buffers 
                lockingScript: '76a9145c69c5e042996ce228704705535c3871b8ffbb3188ac',
                address: "19RdstA92P1gdeVsfEndiNmHFGD7L2eg6V"
            },
            knowledgeAboutPrevTxOut: {
                publicKey: '021bb39c7853e832d27751011ea73e6f0115161278cd3aaf73c3bdae9a59d23f71',
                privateKey: 'Kwx4Zt1vDjZUvQ3Eoxa5zZgt6m8j38cc6U85UX1kfaoYhjcH6DLs',
            },
    }
}

type FakeTxOutData = {
    publicDataAboutPrevTxOut: {
        transactionId: string,
        outputIndex: number,
        valueInSatoshis: string,
        lockingScript: string,
        address: string
    },
    knowledgeAboutPrevTxOut: {
        publicKey: string,
        privateKey: string
    },
}
