var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;

var postSchema = new mongoose.Schema({ 
 title: String, 
 content: String, 
 feature: String,
 created_at: Schema.Types.Date,
 updated_at: Schema.Types.Date
}, {
	collection: 'blogs'
}); 
mongoose.model('Post', postSchema); 