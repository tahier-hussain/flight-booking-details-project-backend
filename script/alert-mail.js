const mongoose = require('mongoose');
const lineReader = require('line-reader');
const nodemailer = require("nodemailer");

//Body Parser
const db = 'mongodb://localhost:27017/node-project-db';

//Connect to MongoDB
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const Alert = require('../models/alerts');

Alert
    .find({ 'status' : true })
    .then(alert => {
        for(var i = 0; i < alert.length; i++) {
            var count = 0;
            var fieldname = alert[i].field_name;
            var range_num = alert[i].range_num;
            var range_type = alert[i].range_type;

            if(range_type == 'Second') {
                range_num *= 1000;
            }
            else if(range_type == 'Minute') {
                range_num *= 60000;
            }
            else if(range_type == 'Hour') {
                range_num *= 3.6e+6;
            }
            else if(range_type == 'Day') {
                range_num *= 8.64e+7;
            }
            else if(range_type == 'Month') {
                range_num *= 2.628e+9;
            }
            else {
                range_num *= 31535965440.0381851;
            }
            var thresold = alert[i].thresold_value;
            var currentDate = new Date();
            var currentTime = currentDate.getTime();
            lineReader.eachLine('/home/hussain/node-projects/node-boilerplate/python_script/Logfile', line => {
                var log_field_name  = ''
                var time = ''
                var index = 0;
                while(line[index] != '[') {
                    index++;
                }
                index++
                var semi = 0;
                while(line[index] != '+') {
                    if(line[index] == '/') {
                        time = time.concat(' ');
                    }
                    else if(line[index] == ':' && semi == 0) {
                        semi = 1;
                        time = time.concat(' ')
                        index++
                        continue
                    }
                    else {
                        time = time.concat(line[index])
                    }
                    index++;
                }
                while(line[index] != '-') {
                    index++;
                    if(index >= line.length) {
                        break
                    }
                }
                index++;
                if(index < line.length) {
                    while(line[index] != '/') {
                        log_field_name = log_field_name.concat(line[index]); 
                        index++;
                    }
                }
                var pastDate = new Date(time);
                var pastTime = pastDate.getTime();
                if(currentTime - pastTime > range_num && log_field_name == fieldname) {
                    count++;
                }
            })

            if(count >= thresold) {
                const output = `
                            <h3> This mail is to alert you that the number of flights has reached its thresold point </h3>
                            <p> The total number of count is beyond the thresold</p>
                            <a>Thank & Regards, </a>
                            <a> Tahier Hussain M </a>
                            `;
                
                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'tahier@codingmart.com', // generated ethereal user
                        pass: 'hussain220598' // generated ethereal password
                    }
                });

                // send mail with defined transport object
                let info = transporter.sendMail({
                    from: '"Tahier Hussain" <tahier@codingmart.com>', // sender address
                    to: alert[i].email, // list of receivers
                    subject: "Alert Message for the flight bookings", // Subject line
                    text: "Hello world?", // plain text body
                    html: output// html body
                });

                console.log("Message sent: %s", info);
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            }

        }
    })
    .catch((err) => console.log(err))

