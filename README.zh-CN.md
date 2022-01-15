# 阿里云DNS云解析记录更新器

## 安装

运行这个 Docker 镜像并设置如下环境变量：

- `ACCESSKEY_ID`: 阿里云账号的 Access key ID.
- `ACCESSKEY_SECRET`: 阿里云账号的 Access key secret.

例如：

```bash
docker run --name test-aliyun-ddns -it -p 3000:3000 -e ACCESSKEY_ID=$ACCESSKEY_ID -e ACCESSKEY_SECRET=$ACCESSKEY_SECRET aliyun-ddns
```

## 用法

要更新 DNS 记录，需要知道记录相应的 `RecordID`。
`RecordID` 可以通过 [Aliyun API Explorer](https://api.aliyun.com/#/?product=Alidns&version=2015-01-09&api=DescribeDomainRecords) 获取。
在使用上述样例中的方法运行 Docker 镜像后，有两个 Web API 可以用来更新 DNS 记录。

如果需要自动获取 IP 地址，可以像这样发送一个请求：

```bash
wget "http://127.0.0.1:3000/ddns/auto?record=RecordID&type=A&rr=@"
```

该容器会自动发送一个请求以获取当前的 IP 地址。

如果该容器运行在一个可以自动提供当前 IP 地址的机器上（例如威联通的 NAS），
可以发送这样的一个请求：

```base
wget "http://127.0.0.1:3000/ddns/qnap?record=RecordID&type=A&rr=@&ip=ip"
```

那么该容器会使用提供参数中提供的 IP 地址更新记录。
