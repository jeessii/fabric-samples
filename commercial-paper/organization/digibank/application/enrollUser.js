/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const {
    Wallets
} = require('fabric-network');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
var scanf = require('scanf');
let newUser = " ";


async function main_enrollUser(newUser) {
    try {
        // load the network configuration
        const pathTest = path.join(process.cwd(), './commercial-paper/organization/digibank/gateway/connection-org1.yaml');
        let test = fs.readFileSync(pathTest, {
            encoding: 'utf8',
            flag: 'r'
        })
        let connectionProfile = yaml.load(test);

        // Create a new CA client for interacting with the CA.
        const caInfo = connectionProfile.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, {
            trustedRoots: caTLSCACerts,
            verify: false
        }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        //console.log("User: ");
        //var newUser = scanf('%s');

        //Crear carpeta para cada user nuevo
        fs.mkdir("/identityBlockchain/user/" + newUser + "/wallet", {
            recursive: true
        }, function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log("New directory successfully created.")
            }
        })
        const walletPath = path.join(process.cwd(), '/identityBlockchain/user/' + newUser + '/wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const userExists = await wallet.get(newUser);
        if (userExists) {
            console.log('An identity for the client user ' + newUser + ' already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({
            enrollmentID: 'user1',
            enrollmentSecret: 'user1pw'
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put(newUser, x509Identity);
        console.log('Successfully enrolled client user ' + newUser + ' and imported it into the wallet');

    } catch (error) {
        console.error('Failed to enroll client user ' + newUser + ': ' + error);
        process.exit(1);
    }
}
module.exports = {
    main_enrollUser
};

//main_enrollUser(newUser);