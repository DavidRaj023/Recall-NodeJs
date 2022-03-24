module.exports = (sequelize, Sequelize) => {
    const Hotel = sequelize.define('hotels', {
        name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        owner_username: {
            type: Sequelize.STRING
        },
        stars: {
            type: Sequelize.INTEGER
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
    return Hotel;
}