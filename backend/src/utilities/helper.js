export const generateRandomString = (len = 100) => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIZKLMNOPQRSTUVWXYZ";
    const length = chars.length;
    let random = "";

    for (let i = 0; i < len; i++) {
        let randomPosition = Math.ceil(Math.random() * (length - 1));
        random += chars[randomPosition];
    }

    return random;
};

export const generateDateTime = (min) => {
    const today = new Date();
    const minutes = today.getMinutes();
    today.setMinutes(minutes + Number(min));

    return today;
};
