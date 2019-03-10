
// var test = function( req, res, next ) {
//   console.log( 'middleware dirname', __dirname);
//   next();
// }
//
// module.exports = {
//         getValue: function( app ,dirname ) {
//             console.log('passed dirname', dirname)
//             app.use(test);
//         }
// };

// module.exports = function( ) {
//
//     return {
//         startIo: function( test ) {
//             console.log( test );
//         }
//     }
// }();

module.exports.push = function ( ) {

    return function( msg ) {
      console.log('im gay');
    }
}

module.exports.next = function ( ) {

    return function( req, res, next) { 
       next();
    }
};
