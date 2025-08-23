const validUrl=((string)=>{
    try{
        new URL(string)
    }catch(err){
        return false;
    }
})

export default validUrl;
