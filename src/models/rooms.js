module.exports = (sequelize, Sequelize) =>{
    const Rooms = sequelize.define('rooms', {
        roomId: {
            type: Sequelize.STRING
        },
        hotelName: {
            type: Sequelize.STRING
        },
        owner: {
            type: Sequelize.STRING
        },
        address_line1: {
            type: Sequelize.STRING
        },
        address_line2: {
            type: Sequelize.STRING
        },
        city: {
            type: Sequelize.STRING
        },
        state: {
            type: Sequelize.STRING
        },
        postal_code: {
            type: Sequelize.STRING
        },
        country: {
            type: Sequelize.STRING
        },
        amenitiesList :{
            type: Sequelize.STRING
        },
        likes: {
            type: Sequelize.INTEGER
        },
        currentUserId :{
            type: Sequelize.STRING
        },
        checkedInDate :{
            type: Sequelize.DATE
        },
        checkedOutDate :{
            type: Sequelize.DATE
        },
        status: {
            type: Sequelize.STRING
        },
        createdAt: {
            type: Sequelize.DATE
        },
        updatedAt: {
            type: Sequelize.DATE
        }
    });
    return Rooms;
}