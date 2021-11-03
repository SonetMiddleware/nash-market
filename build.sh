#!/usr/bin/env bash

# yarn build:test
# tar -zcvf dist.tar.gz dist

scp -rp -i ~/.ssh/platwin.spk dist.tar.gz ubuntu@13.213.1.29:/var/www


# deploy在服务器上解压文件即可
# cd /var/www/
# tar -xzvf dist.tar.gz nash.market