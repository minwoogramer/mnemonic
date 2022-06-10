const express = require('express');
const router = express.Router();
const lightWallet = require("eth-lightwallet");
const fs = require('fs');

router.post('/newMnemonic', async(req, res) => {
    let mnemonic;
    try {
        mnemonic = lightWallet.keystore.generateRandomSeed()
        res.json({mnemonic})
    } catch (err) {
        console.log(err);
    }
})

router.post('/newWallet', async(req, res) => {
    let password = req.body.password
    let mnemonic = req.body.mnemonic

    try {
        lightWallet.keystore.createVault(
            {
                password: password
                , seedPhrase: mnemonic
                , hdPathString: "m/0'/0'/0'"
            }
            , function (err, ks) {
                ks.keyFromPassword(
                    password
                    , function(err, pwDerivedKey) {
                        ks.generateNewAddress(pwDerivedKey, 1);
                        let keystore = ks.serialize();
                        fs.writeFile('wallet.json', keystore, 
                            function(err, data) {
                                if(err) {
                                    res.json({code:999, message:'error'})
                                } else {
                                    res.send(200)
                                }
                            }
                        )
                    }
                )
            }
        )
    } catch (exception) {
        console.log('Exception ' + exception)
    }
})

module.exports = router;