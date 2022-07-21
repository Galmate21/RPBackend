const { json } = require('body-parser');
const asyncHandler=require('express-async-handler');

const Felhasznalo=require('../models/felhasznalok');
const generateToken = require('../utils/generateToken');

const register=asyncHandler(async(req, res)=>{
    const {rId,uName,rName,password,email,isAdmin}=req.body;
    

    const felhasznaloVan=await Felhasznalo.findOne({email});

    if(felhasznaloVan){
        res.status(400);
        res.send("Ilyen felhasználó már regisztrálva lett korábban");
        return;
    }
    const felhasznalo=await Felhasznalo.create({
        rId,
        uName,
        rName,
        password,
        email,
        isAdmin
    });
    if(felhasznalo){
        res.status(201).json({
            _id:felhasznalo._id,
            rId:felhasznalo.rId,
            uName:felhasznalo.uName,
            rName:felhasznalo.rName,
            email:felhasznalo.email,
            isAdmin:felhasznalo.isAdmin,
           
            token:generateToken(felhasznalo._id),
            uzenet:"Sikeres regisztráció!"

        });
        
    }else{
        res.sendStatus(400).json({error:"Hiba történt"});
        
        return;
    }

});

const login=asyncHandler(async(req, res)=>{
    const {email,password}=req.body;

    const felhasznalo=await Felhasznalo.findOne({email:email});

    if(felhasznalo&&(await felhasznalo.matchPassword(password))){
        res.status(201).json({
            _id:felhasznalo._id,
            rId:felhasznalo.rId,
            uName:felhasznalo.uName,
            rName:felhasznalo.rName,
            email:felhasznalo.email,
            isAdmin:felhasznalo.isAdmin,
            token:generateToken(felhasznalo._id),
            
        })
    }else{
        
        res.status(400).json({
            error:"Hibás név vagy jelszó!"
        })
        return;
    }

});

module.exports={register,login};