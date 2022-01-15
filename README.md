# A Web Server Docker for Updating Aliyun DNS Records

[中文文档](./README.zh-CN.md)

## Installation

Run docker this docker image with these environment variables:

- `ACCESSKEY_ID`: Access key ID.
- `ACCESSKEY_SECRET`: Access key secret.

For example:

```bash
docker run --name test-aliyun-ddns -it -p 3000:3000 -e ACCESSKEY_ID=$ACCESSKEY_ID -e ACCESSKEY_SECRET=$ACCESSKEY_SECRET aliyun-ddns
```

## Usage

To update a DNS record, the corresponding `RecordID` needs to be known. 
It can be checked with [Aliyun API Explorer](https://api.aliyun.com/#/?product=Alidns&version=2015-01-09&api=DescribeDomainRecords).

After running this docker like examples, there are two web APIs to update this record.

If you what to get current IP address automatically, send a request like this

```bash
wget "http://127.0.0.1:3000/ddns/auto?record=RecordID&type=A&rr=@"
```

this container will send a request to get current IP address.

If you are running on a machine that is able to provide current IP address (like QNAP),
let it send a request like this

```base
wget "http://127.0.0.1:3000/ddns/qnap?record=RecordID&type=A&rr=@&ip=ip"
```

then this container will update the record with provided IP address.
