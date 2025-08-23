function validUrl(string){
    try{
        new URL(string)
    }catch(err){
        return false;
    }
    return true;
}

export default validUrl;
