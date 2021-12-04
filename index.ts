import * as bsv from 'bsv'
import { makeDataTx, makeTxToAddress, makeTxWithDataAndSendToAddress } from './demos/constructTxDemo'
import { logInfoAboutTx } from './demos/logInfoAboutTx'

// SETUP //

const privKey = "L2w3w37XDZNHDWpjMHWqHacqNQBA562SFcQAp53ttQbrvprTa5qP" // generated with "PrivKey.fromRandom()"
const pubKey = bsv.PubKey.fromPrivKey(bsv.PrivKey.fromString(privKey)).toString() // 027fd47e6dc6efb93f3ffa14fc54e19a74402786d07032f56842059fafa3c5b089
const address = bsv.Address.fromPrivKey(bsv.PrivKey.fromString(privKey)).toString() // 1M88AkQ9J2YXFTfXzWu6cdPcagvrj2m8SQ

const privKey2 = "KxZxbHwYeaH4kXd4Dg4eph528GecW2p57vUiMpD2bmrd6Df48LZt" // generated with "PrivKey.fromRandom()"
const pubKey2 = bsv.PubKey.fromPrivKey(bsv.PrivKey.fromString(privKey2)).toString() // 022ae82e4532a10a7930e57b0fab192f482ecd1c7ca3c4918e1aca3dd6e95e05e1
const address2 = bsv.Address.fromPrivKey(bsv.PrivKey.fromString(privKey2)).toString() // 1GwAKhdC3exhz4hnjX2N4iwRbiTf3wjLrU

// DEMOS //

const txToAddr = makeTxToAddress(address, "200000", address2)
logInfoAboutTx('Tx To Address', txToAddr)

const txWithData = makeDataTx(Buffer.from("this is the data that will be written in the transaction"), address2)
logInfoAboutTx('Tx With Data', txWithData)

const txWithDataAndAddr = makeTxWithDataAndSendToAddress(Buffer.from("some data"), address, "200000", address2)
logInfoAboutTx('Tx With Data and To Address', txWithDataAndAddr)

