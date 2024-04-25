const { DataTypes } = require("sequelize");

module.exports =(sequelize,DataTypes) =>{
    const Employee = sequelize.define("employee",{
        empid: {
            type: DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement :true

        },
        name: DataTypes.STRING,
        email:{
            type : DataTypes.STRING,
            defaultValue : 'def@gmail.com'
        },
        gender : DataTypes.STRING
    },{
        tableName : 'employee',
        timestamps: false
    })
    return Employee;
}