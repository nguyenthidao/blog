var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	multer = require('multer')
	;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })

router.route('/').get(function(req, res, next){
		mongoose.model('Post').find({}, function (err, postList) {
			if(err){
				res.render('error', {
					message: 'not found', 
					error:{
						status: 404
					}
				});
			}else{
				res.render('post/index', {
                            title: 'WORK HARD', 
                            postList : postList
                });
			}
		});
});

router.get('/new', function(req, res) {
    res.render('post/new', { title: 'Add New Post' });
})
.post('/', upload.single('feature'), function(req, res) {
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
		}, function (err) {
			if(err){
				res.render('error', {
					message: 'error creating', 
					error:{
						status: 500
					}
				});
			}else{
				res.redirect('/blog/posts');
			}
		});
});

router.get('/:id/delete', function(req, res){
	mongoose.model('Post').findById(req.params.id, function(err, post){
		if(err){
			res.render('error', {
					message: 'not found', 
					error: {
						status: 500
					}
			});
		}else{
			res.render('post/delete', {
				'post': post
			});
		}
	});
})
.post('/:id/delete', function(req, res){
	mongoose.model('Post').findById(req.params.id, function(err, post){
		if(err){
			res.render('error', {
				message: 'not found', 
				error:{
					status: 500
				}
			});
		}else{
			post.remove(function(err, blog){
				res.redirect('/blog/posts');
			});
		}
	});
});	

router.get('/:id/edit',function(req, res){
	mongoose.model('Post').findById(req.params.id, function(err, post){
		if(err){
			res.render('error', {
					message: 'not found', 
					error: {
						status: 500
					}
			});
		}else{
			res.render('post/edit', {
				'post': post
			});
		}
	});
})
.post('/:id/edit', upload.single('feature'), function(req, res){
    var title = req.body.title;
	var content = req.body.content;
	var feature = '/images/' + req.file.filename;
	var created_at = Date.now();
	var updated_at = Date.now();                          

	mongoose.model('Post').findById(req.params.id, function(err, post){
		if(err){
			res.render('err', {
				message: 'not found',
				error : {
					status : 500
				}
			})
		}else{
			post.update({
				title : title,
				content : content,
				feature : feature,
				created_at : created_at,
				updated_at : updated_at
			}, function(err, post){
				if(err){
					res.render('error', {
						message: 'error editing', 
						error:{
							status: 500
						}
					});
				}else{
					res.redirect('/blog/posts');
				}
			});
		}
	})
});
router.get('/:id', function(req, res){
	mongoose.model('Post').findById(req.params.id, function(err, post){
		if(err){
			res.render('err', {
				message: 'not found',
				error : {
					status : 500
				}
			})
		}else{
			res.render('post/edit', {
				post: post
			});
		}
	});
});
module.exports = router;