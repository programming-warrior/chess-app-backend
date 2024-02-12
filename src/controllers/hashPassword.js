const bcrypt=require('bcrypt');
async function hashPassword(text,salt){
    try{
        const cipher=await bcrypt.hash(text,salt);
        return cipher;
    }
    catch(e){
        return null;
    }
}

async function compareHashedPassword(password,encryptedPassword){
    try{
        const result=await bcrypt.compare(password,encryptedPassword);
        return result;
    }
    catch(e){
        return false;
    }   
}


module.exports={
    hashPassword,
    compareHashedPassword
};