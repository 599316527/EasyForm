exports.port = 8810;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

exports.getLocations = function () {
    return [
        { 
            location: function(request) {
                return /\/$/.test(request.pathname);
            },
            handler: home( 'index.html' )
        },
        { 
            location: /^\/redirect-local/, 
            handler: redirect('redirect-target', false) 
        },
        { 
            location: /^\/redirect-remote/, 
            handler: redirect('http://www.baidu.com', false) 
        },
        { 
            location: /^\/redirect-target/, 
            handler: content('redirectd!') 
        },
        { 
            location: '/empty', 
            handler: empty() 
        },
        { 
            location: /\.css($|\?)/, 
            handler: [
                autocss()
            ]
        },
        { 
            location: /\.less($|\?)/, 
            handler: [
                file(),
                less()
            ]
        },
        { 
            location: /\.styl($|\?)/, 
            handler: [
                file(),
                stylus()
            ]
        },
        { 
            location: /^.*$/, 
            handler: [
                function (context) {
                    context.stop();

                    if (!context.header['Access-Control-Allow-Origin']) {
                        context.header['Access-Control-Allow-Origin'] = '*';
                    }

                    if (!context.header['Access-Control-Allow-Headers']) {
                        context.header['Access-Control-Allow-Headers'] = 'X-Request-By, X-Requested-With';
                    }

                    context.start();
                },
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

exports.injectResource = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};
