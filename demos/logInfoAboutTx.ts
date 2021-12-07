import { Tx } from "bsv";

export function logInfoAboutTx(title:string, tx:Tx) {
    console.log(`\n`)
    console.log(`\n`)
    console.log(`--- ${title} ---`)
    console.log(`TXID:\n${tx.id()}`)
    console.log(`---`)
    console.log(`HEX:\n${tx.toHex()}`)
    console.log(`---`)
    console.log(`IN:`)
    for (let i = 0; i < tx.txIns.length; i++) {
        console.log(` - input #${i} comes from "${tx.txIns[i].txHashBuf.toString("hex")}:${tx.txIns[i].txOutNum}"`)
    }
    console.log(`---`)
    console.log(`OUT:`)
    for (let i = 0; i < tx.txOuts.length; i++) {
        console.log(` - output #${i} with value ${tx.txOuts[i].valueBn.toString(10)} goes to script "${tx.txOuts[i].script.toAsmString()}"`)
    }
    console.log(`--- END ---`)
}