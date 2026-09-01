
class register {
    async registerFnction (){

        return res.status(201).json("this is register page by mysterio")

    }catch(err){
        console.log(err)
        return res.status(500).json("internals server error")

    }
    }    




module.exports ={
    register
}