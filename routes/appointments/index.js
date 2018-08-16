exports.index = function(req, res){
    res.send({
        message: 'Appoints service API',
        details: 'This is a REST api where you can schedule appointments for' +
        ' Jamnjam',
        _links: {
            self: { href: '/' },
            me: { href: '/me' },
            appointments: { href: '/appointments' }
        }
    })
};
