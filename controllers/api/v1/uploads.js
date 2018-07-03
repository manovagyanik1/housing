const express = require('express');
const userValidator = require('../../../utilities/validators/user_validators');
const userHelper = require('../../../utilities/helpers/user_helper');
const wrap = require('decorator-wrap').wrap;
const genUtil = require('../../../utilities/genutils/index');
const middlewares = require('../../../utilities/controller_middlewares');
const permissions = require('../../../utilities/permisson_utility');
const pageLimit = 50;
const models = require('../../../db/models/index');
const config = require('../../../config/index');
const uuid4 = require('uuid/v4');
const fs = require('fs');
const validator = require('validator');
const multer = require('multer');
const util = require('util');
const mimes = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

const router = express.Router();

if (!fs.existsSync(config.baseUploadDir)) {
    fs.mkdirSync(config.baseUploadDir);
    if(!fs.existsSync(config.baseUploadDir + '/' + config.baseImageUploadDir))
        fs.mkdirSync(config.baseUploadDir + '/' + config.baseImageUploadDir);
}


router.post('/images', async (req, res, next) => {
    let files = Object.keys(req.files);
    for (let i = 0; i < files.length; i++) {
        let kycFile = req.files[files[i]];
        var name = req.files[files[i]].name;
        let filePath = util.format('%s/%s/%s-%s', config.baseUploadDir, config.baseImageUploadDir, uuid4(), name);
        let url = config.baseUrl + "/" + filePath;
        kycFile.mv(filePath, async (err) => {
            if (err) {
                console.log(err);
                genUtil.sendJsonResponse(res, 400, err, null)
            }else {
                genUtil.sendJsonResponse(res, 200, 'Uploaded successfully', {uploadUrl: url})
            }
        });
    }
});

module.exports = router;