const express = require('express');
const router = express.Router();
const lineReader = require('line-reader');
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

async function run (text, search_for) {
    lineReader.eachLine('../../python_script/Logfile',function(line) {
      //The below process will read each line from the log file
      //It will extract the required substring and store it in a particular variable
        var start = 0;
        var end = 0;
        while(line[end] != ' ') {
          end++;
        }
        let ip = (line.substring(start, end)).trim();
        start = end;
        while(line[start] != '[') {
          start++;
        }
        while(line[end] != ']') {
          end++;
        }
        let time_stamp = (line.substring(start + 1, end)).trim();
        start = end;
        while(line[start] != '"') {
          start++;
        }
        while(line[start] != ' ') {
          start++;
        }
        end = start + 1;
        while(line[end] != '"') {
          end++;
        }
        let url = (line.substring(start + 1, end)).trim();
        start = end + 1;
        end = end + 1;
        while(line[end] != '"') {
          end++;
        }
        let res = ((line.substring(start, end)).trim()).split(" ");
        let response_code = res[0];
        let response_time = res[1];

        client.index({
          index: 'flight-booking-details',
          body: {
            ip: ip,
            response_code: response_code,
            response_time: response_time,
            time_stamp: time_stamp,
            url: url,
            detail: line
          }
        }).catch(console.err)
    })
  
    await client.indices.refresh({ index: 'flight-booking-details' })
  
    // Let's search!
    //Based on the value for 'search_for' the particular search will be executed
    if(search_for == 'response code') {
      const { body } = await client.search({
        index: 'flight-booking-details',
        body: {
          query: {
            match: { response_code: text }
          }
        }
      }).catch(console.err)
      return body
    }
    else if(search_for == 'response time') {
      const { body } = await client.search({
        index: 'flight-booking-details',
        body: {
          query: {
            match: { response_time: text }
          }
        }
      }).catch(console.err)
      return body
    }
    else if(search_for == 'client') {
      const { body } = await client.search({
        index: 'flight-booking-details',
        body: {
          query: {
            match: { client: text }
          }
        }
      }).catch(console.err)
      return body
    }
    else if(search_for == 'timestamp') {
      const { body } = await client.search({
        index: 'flight-booking-details',
        body: {
          query: {
            match: { time_stamp: text }
          }
        }
      }).catch(console.err)
      return body
    }
    else if(search_for == 'url') {
      const { body } = await client.search({
        index: 'flight-booking-details',
        body: {
          query: {
            match: { url: text }
          }
        }
      }).catch(console.err)
      return body
    }
  }

router.get('/',async (req, res) => {
    const text  = req.body.text
    const search_for = req.body.search_for
    let data = await run(text, search_for)
    res.json(data)
})

module.exports = router;