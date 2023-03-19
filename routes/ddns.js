const Core = require('@alicloud/pop-core');
const axios = require('axios').default;
const moment = require('moment');
const express = require("express");
var router = express.Router();

function updateDNS(ip, record, type, rr) {
    var client = new Core({
        accessKeyId: process.env.ACCESSKEY_ID,
        accessKeySecret: process.env.ACCESSKEY_SECRET,
        endpoint: 'https://alidns.aliyuncs.com',
        apiVersion: '2015-01-09'
    });
    var describeDomainRecordInfoParams = {
        "RecordId": record
    };
    var requestOption = {
        method: "POST"
    };
    return new Promise((resolve, reject) => {
        client.request("DescribeDomainRecordInfo", describeDomainRecordInfoParams, requestOption).then((result) => {
            var oldIP = result.Value;
            if (oldIP != ip) {
                var updateDomainRecordParams = {
                    "RecordId": record,
                    "RR": rr,
                    "Type": type,
                    "Value": ip
                };
                client.request("UpdateDomainRecord", updateDomainRecordParams, requestOption).then(() => {
                    resolve("OK");
                }).catch((reason) => {
                    reject("UpdateDomainRecord error: " + reason);
                });
            } else {
                resolve("Unchanged");
            }
        }).catch((reason) => {
            reject("DescribeDomainRecordInfo error: " + reason);
        });
    });
}

router.get('/auto', function (req, res) {
    var query_keys = ["record", "type", "rr"];
    var query_keys_check = query_keys.every(item => (item in req.query));
    if (!query_keys_check) {
        console.error("Missing:", query_keys.filter(item => !(item in req.query)).join(","));
        res.sendStatus(500);
        return;
    }
    console.log(req.query);
    var recordID = req.query.record;
    var recordType = req.query.type;
    var recordRR = req.query.rr;
    axios.get("http://www.taobao.com/help/getip.php?t=" + moment().format("x")).then((response) => {
        if (response.data) {
            var matched = /(\d{1,3}\.){3}\d{1,3}/.exec(response.data);
            if (matched && matched.length) {
                var newIP = matched[0];
                updateDNS(newIP, recordID, recordType, recordRR).then((response) => {
                    console.log(response);
                    res.sendStatus(200);
                }).catch((reason) => {
                    console.error(reason);
                    res.sendStatus(500);
                });
            }
        }
    });
})

/** DDNS */
router.get('/qnap', function (req, res) {
    var query_keys = ["ip", "record", "type", "rr"];
    var query_keys_check = query_keys.every(item => (item in req.query));
    if (!query_keys_check) {
        console.error("Missing:", query_keys.filter(item => !(item in req.query)).join(","));
        res.sendStatus(500);
        return;
    }
    console.log(req.query);
    var newIP = req.query.ip;
    var recordID = req.query.record;
    var recordType = req.query.type;
    var recordRR = req.query.rr;
    updateDNS(newIP, recordID, recordType, recordRR).then((response) => {
        console.log(response);
        res.sendStatus(200);
    }).catch((reason) => {
        console.error(reason);
        res.sendStatus(500);
    });
})

module.exports = router;
