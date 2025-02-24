import express from 'express';

var router = express.Router();

// COMMENT: Example of login stuff. Can be changed to something else

router.get('/myIdentity', async (req, res) => {
	try {
    if (!req.session.account) {
      res.json({status: 'loggedout'});
    }
    else {
      res.json({
        status: 'loggedin',
        userInfo: {
           name: req.session.account.name,
           username: req.session.account.username}
     });
    }
	} catch(err) {
    console.log(err);
		res.status(500).json({'status': 'error', 'error': err});
	}
});

export default router;