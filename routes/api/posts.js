var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	multer = require('multer'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override')
	;

router.use(bodyParser.urlencoded())
router.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({ 
	storage: storage 
});

router.route('/').get(function(req, res, next){
		mongoose.model('Post').find({}, function (err, postList) {
			if(err){
				res.send(err);
			}else{
				res.json({
					postList : postList
				});
			}
		});
});

router.post('/', upload.single('feature'), function(req, res) {
		var title = req.body.title;
		var content = req.body.content;
		var feature = '/images/' + req.file.filename;
		var created_at = Date.now();
		var updated_at = Date.now();

		mongoose.model('Post').create({
			title : title,
			content : content,
			feature : feature,
			created_at : created_at,
			updated_at : updated_at
		}, function (err, post) {
			if(err){
				res.send(err);
			}else{
				res.json({
					post: post
				});
			}
		});
});

router.delete('/:id', function(req, res){
	mongoose.model('Post').findById(req.params.id, function(err, post){
		if(err){
			res.send(err);
		}else{
			post.remove(function(err, postID){
				res.json({
					message: 'deleted',
					post:  postID
				});
			});
		}
	});
});	

router.put('/:id', upload.single('feature'), function(req, res){
    var title = req.body.title;
	var content = req.body.content;
	var feature = '/images/' + req.file.filename;
	var created_at = Date.now();
	var updated_at = Date.now();                          

	mongoose.model('Post').findById(req.params.id, function(err, post){
		if(err){
			res.send(err);
		}else{
			post.update({
				title : title,
				content : content,
				feature : feature,
				created_at : created_at,
				updated_at : updated_at
			}, function(err, postID){
				if(err){
					res.send(err);;
				}else{
					res.json({
						message: 'edited',
						post:  postID
					});
				}
			});
		}
	})
});

router.get('/:id', function(req, res){
	mongoose.model('Post').findById(req.params.id, function(err, post){
		if(err){
			res.send(err);
		}else{
			res.json({
				post: post
			});
		}
	});
});
module.exports = router;