function generateRandomId() {
    let len = 5;
    const str = "aorbcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 5; i++) {
        let randomIndex = Math.floor(Math.random() * str.length);
        result += str[randomIndex];
    }
    return result;
}

module.exports=generateRandomId;