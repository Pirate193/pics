const formidable = require('express-formidable');

const parseForm = formidable({
    encoding:'utf-8',
    multiples:true,
    keepExtensions:true,
    maxFieldsSize:10*1024*1024,
    filter:({name,mimetype})=>{
        return mimetype && mimetype.includes('image');
    }
});

module.exports = { parseForm };