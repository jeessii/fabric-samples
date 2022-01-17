'use strict';

import fs from 'fs';

let user = '';

async function checkUsers(user) {
    try {
        const folderBlockchain = fs.existsSync('../web_tfg/identityBlockchain/user/' + user);
        console.log(folderBlockchain);
        const folderMySQL = fs.existsSync('../web_tfg/identityMySQL/user/'+user);
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