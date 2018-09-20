const {ObjectID}=require('mongodb');
const validateId=function(req,res,next){
    if(!ObjectID.isValid(req.params.id)){
        res.send({
            notice:'Invalid object Id'
        });
    }else{
        next();
    }
};

module.exports={
    validateId
}