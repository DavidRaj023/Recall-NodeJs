const express = require('express');
const router = new express.Router();
const admin = require('../controller/adminController');
const owner = require('../controller/ownerController')
const room = require('../controller/roomController');
const user = require('../controller/userController');
const authenticateToken = require('../middleware/authTocken');

let routes = (app) => {
    try {
        //Admin: SignUp, signIn, signOut, Create Owner
        //Owner: signIn (EmailVerification), signOut.
        //Rooms: Create, update, delete

        //User: Create, update
        //Booking: book a hotel

        //Admin SignUp
        router.post('/api/v1/oyo/admin/signup', admin.create);
        //Admin SignIn
        router.post('/api/v1/oyo/admin/login', admin.login);
        //Admin Logout
        router.post('/api/v1/oyo/admin/logout', admin.logout);
        //Admin: Create owner:
        router.post('/api/v1/oyo/admin/owner', authenticateToken, owner.create);
        //Owner Login
        router.post('/api/v1/oyo/owner/login', owner.login);
        //Logout
        router.post('/api/v1/oyo/owner/logout', owner.logout);
        //Create Room with Owner cred
        router.post('/api/v1/oyo/room', authenticateToken, room.create);
        //Update Room with Owner cred
        router.put('/api/v1/oyo/room', authenticateToken, room.update);
        //Export all the rooms with Owner cred
        router.post('/api/v1/oyo/room/export', authenticateToken, room.export);
        //Delete room
        router.post('/api/v1/oyo/room/remove', authenticateToken, room.delete);
        //User Sign up
        router.post('/api/v1/oyo/user/signup', user.signup);
        //user sign in
        router.post('/api/v1/oyo/user/signin', user.signin);
        //Search for room
        //router.get('/api/v1/oyo/room/search',authenticateToken, room.search);
        
        app.use(router);    
    } catch (error) {
        console.log(error);
    }
};

module.exports = routes;