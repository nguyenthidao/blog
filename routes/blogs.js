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
		mongoose.model('Blog').find({}, function (err, blogList) {
			if(err){
				res.render('error', {
					message: 'not found', 
					error:{
						status: 404
					}
				});
			}else{
				res.render('blog/index', {
                            'title': 'WORK HARD', 
                            'blogList' : blogList
                });
			}
		});
});

router.get('/new', function(req, res) {
    res.render('blog/new', { title: 'Add New Blog' });
})
.post('/new', upload.single('feature'), function(req, res) {
		var title = req.body.title;
		var content = req.body.content;
		var feature = '/images/' + req.file.filename;
		var created_at = Date.now();
		var updated_at = Date.now();

		mongoose.model('Blog').create({
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
				res.redirect('/blogs');
			}
		});
});

router.get('/:id/delete', function(req, res){
	mongoose.model('Blog').findById(req.params.id, function(err, blog){
		if(err){
			res.render('error', {
					message: 'not found', 
					error: {
						status: 500
					}
			});
		}else{
			res.render('blog/delete', {
				'blog': blog
			});
		}
	});
})
.post('/:id/delete', function(req, res){
	mongoose.model('Blog').findById(req.params.id, function(err, blog){
		if(err){
			res.render('error', {
				message: 'not found', 
				error:{
					status: 500
				}
			});
		}else{
			blog.remove(function(err, blog){
				res.redirect('/blogs');
			});
		}
	});
});	

router.get('/:id/edit',function(req, res){
	mongoose.model('Blog').findById(req.params.id, function(err, blog){
		if(err){
			res.render('error', {
					message: 'not found', 
					error: {
						status: 500
					}
			});
		}else{
			res.render('blog/edit', {
				'blog': blog
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

	mongoose.model('Blog').findById(req.params.id, function(err, blog){
		if(err){
			res.render('err', {
				message: 'not found',
				error : {
					status : 500
				}
			})
		}else{
			blog.update({
				title : title,
				content : content,
				feature : feature,
				created_at : created_at,
				updated_at : updated_at
			}, function(err, blog){
				if(err){
					res.render('error', {
						message: 'error editing', 
						error:{
							status: 500
						}
					});
				}else{
					res.redirect('/blogs');
				}
			});
		}
	})
});
router.get('/:id', function(req, res){
	mongoose.model('Blog').findById(req.params.id, function(err, blog){
		if(err){
			res.render('err', {
				message: 'not found',
				error : {
					status : 500
				}
			})
		}else{
			res.render('blog/detail', {
				'blog': blog
			});
		}
	});
});
module.exports = router;