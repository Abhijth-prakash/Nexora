

const register = async (req,res)=>{
    try{

        return res.status(201).json("this is register page")

    }catch(err){
        console.log(err)
        return res.status(500).json("internals server error")

    }
}


module.exports ={
    register
}