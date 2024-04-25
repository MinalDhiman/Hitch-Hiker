var express = require('express');
var router = express.Router();
const database = require("../models");
// To sync our database to all the models
database.sequelize.sync();


// GET employee with a specific id, as provided in the URL parameters
router.get("/:id", async function(req,res,next){
    const empid=req.params.id;
    let emp=await database.employee.findOne({where: {id: empid}});
    console.log("From database: "+emp);
    res.send(emp);
})
// GET all the employees in the database
router.get("/", async function(req,res,next){
    let emps=await database.employee.findAll({});
    console.log("From database: "+emps);
    res.send(emps);
})


// Create an employee (POSTMAN)
router.post("/create", async function(req,res,next){
    const emp=req.body;
    console.log("From client to create new: "+req.body);
    let empsaved=await database.employee.create(emp);
    res.send(empsaved);
})
// router.post("/", async function(req,res,next){
//     let emp1={
//         name: "Hosea Matthews",
//         email: "matthews@gmail.com",
//         gender: "M"
//     };

//     let empsaved=await database.employee.create(emp1);
// })


// Update an employee (POSTMAN)
router.put("/update", async(req,res,next)=>{
    const emp=req.body;
    let empindb=await database.employee.findOne({where: {id: emp.id}});

    if(!empindb){
        res.json({message: `employee with ${emp.id} doesn't exist`});
    }

    empindb.name=emp.name;
    empindb.email=emp.email;
    empindb.gender=emp.gender;

    let updatedemp=await empindb.save();
    res.send(updatedemp);
})
// router.put("/", async(req,res,next)=>{
//     let updatedEmp=await database.employee.update(
//         {gender: "F"},
//         {where: {empid: 105}}
//     );
//     res.send(updatedEmp);
// })


// Delete an employee (POSTMAN)
router.delete("/:id", async(req,res,next)=>{
    try{
        const empid=req.params.id;
        await database.employee.destroy({where: {id: empid}});
        res.json({result: "success", action: "deleted", message: `${empid} was deleted`});
    }
    catch(err){
        next(err);
    }
})
// router.delete("/", async(req,res,next)=>{
//     let result=database.employee.destroy({where: {id: 105}});
//     res.send(result);
// })

module.exports=router;