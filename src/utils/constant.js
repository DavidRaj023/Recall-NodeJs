exports.ADMIN_INSERT = "INSERT INTO [dbo].[admin] (name,email,password) VALUES (@name,@email,@password)";
exports.QUERY_GETALLDATA = "SELECT name, male, female FROM [dbo].[admin];"
exports.QUERY_GETALLUSERNAME = "SELECT userName FROM [dbo].[admin];"

exports.OWNER_INSERT = "INSERT INTO [dbo].[owner] (name,email,phoneNumber,userName,password,hotels) VALUES (@name,@email,@phoneNumber,@userName,@password,@hotels)";

exports.HEADER = [{
        header: 'RoomId',
        key: 'roomId',
        width: 10
    },
    {
        header: 'Hotel Name',
        key: 'hotelName',
        width: 10
    },
    {
        header: 'Address_Line1',
        key: 'address_line1',
        width: 15
    },
    {
        header: 'Address_Line2',
        key: 'address_line2',
        width: 10
    },
    {
        header: 'City',
        key: 'city',
        width: 10
    },
    {
        header: 'State',
        key: 'state',
        width: 10
    },
    {
        header: 'PostalCode',
        key: 'postal_code',
        width: 15
    },
    {
        header: 'Country',
        key: 'country',
        width: 10
    },
    {
        header: 'Amenities List',
        key: 'amenitiesList',
        width: 10
    },
    {
        header: 'Likes',
        key: 'likes',
        width: 10
    },
    {
        header: 'Current UserId',
        key: 'currentUserId',
        width: 10
    },
    {
        header: 'Status',
        key: 'status',
        width: 10
    }
];

exports.EXPORT_EXCEL = './data/Room_Export.xlsx';