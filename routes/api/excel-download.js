const express = require('express');
const router = express.Router();
const stringify = require('csv-stringify');
const lineReader = require('line-reader');
const fs = require('fs');

async function run() {
    lineReader.eachLine('/home/hussain/node-projects/node-boilerplate/python_script/Logfile', (line) => {
        var index = 0;
        var ip = '';
        var timestamp = '';
        var url = '';
        var responseCode = '';
        var responseTime = '';
    
        while(line[index] != ' ') {
            ip = ip.concat(line[index]);
            index++;
        }
        while(line[index] != '[') {
            index++;
        }
        while(line[index] != ']') {
            timestamp = timestamp.concat(line[index]);
        }
        while(line[index] != '"') {
            index++;
        }
        while(line[index] != ' ') {
            index++;
        }
        index++;
        while(line[index] != '"') {
            url = url.concat(line[index]);
            index++;
        }
        while(line[index] != ' ') {
            index++;
        }
        index++;
        while(line[index] != ' ') {
            responseCode = responseCode.concat(line[index]);
            index++;
        }
        index++;
        while(line[index] != ' ') {
            responseTime = responseTime.concat(line[index]);
            index++;
        }
    
        fs.readFile('/home/hussain/node-projects/node-boilerplate/excel-data.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
            var obj = JSON.parse(data); //now it an object
            obj.push({
                ip: ip,
                timestamp: timestamp,
                url: url,
                responseCode: responseCode,
                responseTime: responseTime
            }); //add some data
            var json = JSON.stringify(obj); //convert it back to json
            fs.writeFile('/home/hussain/node-projects/node-boilerplate/excel-data.json', json, 'utf8', callback); // write it back 
        }});
    })
}

let excel_data;

router.get('/', async (req, res) => {
    // adding appropriate headers, so browsers can start downloading
    // file as soon as this request starts to get served
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'Logs-' + Date.now() + '.csv\"');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Pragma', 'no-cache');

    run()
    .then(() => excel_data = require('../../excel-data.json'))
    .catch(() => res.status(400).json({ msg : 'Something went wrong'}))

    await stringify(excel_data, { header: true })
    .pipe(res)
    .catch(() => res.status(400).json({ msg : 'Error in parsing the excel'}))

    res.json({msg : 'Excel has been successfully downloaded'})
    .catch(() => res.status(400).json({ msg : 'Error in downloading the excel'}))
})


module.exports = router;