var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var User = new Schema({
    name    : String,
    password    : String
});

var Post = new Schema({
	username : String,
	post : String,
	time : Date
})

mongoose.model( 'User', User );
mongoose.model( 'Post', Post );
mongoose.connect( 'mongodb://localhost/microblog' );
