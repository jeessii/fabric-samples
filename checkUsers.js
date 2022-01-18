'use strict';

import fs from 'fs';

let user = '';

async function checkUsers(user) {
    try {
        const folderBlockchain = fs.existsSync('../fabric-samples/identityBlockchain/user/' + user);
        console.log(folderBlockchain);
        const folderMySQL = fs.existsSync('../fabric-samples/identityMySQL/user/'+user);
        console.log(folderMySQL);
        if (folderBlockchain && folderMySQL) {
            console.log('Users exists on both sides');
            return true;

        } else
            console.log('Algún usuario no existe')

    } catch {
        console.log('Error');
    }
};

//checkUsers(user);
export default checkUsers;