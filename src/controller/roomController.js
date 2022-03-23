const db = require('../service/dbService');
const Room = db.Room;
const Owner = db.Owner;
const User = db.User;
const excel = require('../utils/excel');
const constants = require('../utils/constant');

exports.create = async(req, res) => {
    try {
        if(!req.body) throw new Error("Enter all the details to create new room");
        if((!req.body.roomId) || (!req.body.hotelName) || (!req.body.owner)) throw new Error("Enter all the details to create new Room");

        const data = await Owner.findOne({ where: {email: `${req.user._id}`} });
        if(!data) throw new Error("Access Denied");
        console.log(data.dataValues);
        const owner = data.dataValues;
 
        //Check email
        const checkRoomId = await Room.findOne({ where: {roomId: `${req.body.roomId}`} });
        console.log(checkRoomId);
        if(checkRoomId){
            throw new Error("Given roomId id is already taken");
        }

         const room = {
            roomId: req.body.roomId,
            hotelName: req.body.hotelName,
            owner: owner.userName,
            address_line1: req.body.address_line1,
            address_line2: req.body.address_line2,
            city: req.body.city,
            state: req.body.state,
            postal_code: req.body.postal_code,
            country: req.body.country,
            amenitiesList: req.body.amenitiesList,
            likes: req.body.likes,
            status: req.body.status
        }
        
        //Save Owner in DB
        Room.create(room).then(data => {
            return res.status(201).send({
                message: "New Room Successfully created",
                id: data.id
            });
        }).catch(err =>{
            console.log(err);
            res.status(400).send({
                message: err.message || "Unable to create new Room, please try again"
            });
        }); 

    } catch (error) {
        console.log(error.message);
        res.status(400).send({
            message: error.message
        })
    }
}

exports.update = async(req, res) => {
    try {
        if(!req.body) throw new Error("Enter the details to update new Room");
        const owner = await Owner.findOne({ where: {email: `${req.user._id}`} });
        const room = await Room.findOne({ where: {id: `${req.body.id}`}});

        if(!owner) throw new Error("Access denied");
        if(owner.dataValues.userName != room.dataValues.owner) throw new Error("Access denied");

        Room.update(req.body, {where: {id: req.body.id}})
        .then(num => {
            if(num != 1) return res.send({
                message: "Unable to update the given details"
            })
            return res.send({
                message: "Successfully Updated"
            })
        }).catch(err => {
            throw new Error (err.message);
        })

    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
}

exports.delete = async(req, res) =>{
    try {
        if(!req.body.id) throw new Error("Enter the id to delete a room");
        const owner = await Owner.findOne({ where: {email: `${req.user._id}`} });
        const room = await Room.findOne({ where: {id: `${req.body.id}`}});
        if(!owner) throw new Error("Access denied");
        if(!room) throw new Error("Unable to find the room with id: " + req.body.id);
        if(owner.dataValues.userName != room.dataValues.owner) throw new Error("Access denied");

        Room.destroy({where: {id: req.body.id}})
        .then(num => {
            if(num != 1) return res.send({
                message: "Unable to delete the given details"
            })
            return res.send({
                message: "Successfully deleted"
            })
        }).catch(err => {
            throw new Error (err.message);
        })

    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
}

exports.export = async(req, res) => {
    try {
        const user = await Owner.findOne({ where: {email: `${req.user._id}`} });
        if(!user) throw new Error("Access denied");
        const owner = user.dataValues.userName;
        const room = await Room.findAll({raw: true, where: {owner: `${owner}`} });
        if(!room) throw new Error("Unable to find the room for user: " + owner);
        const date = new Date().getTime();
        await excel.excelWriteAll(room, constants.HEADER, `./data/${owner}_${date}.xlsx`);
        return res.status(200).send({
            message: "Excel Successfully Exported",
            rooms: room 
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: error.message
        })
    }
}