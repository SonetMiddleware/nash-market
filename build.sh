#!/usr/bin/env bash

yarn build
tar -zcvf dist.tar.gz dist

scp -rp -i ~/.ssh/platwin.spk dist.tar.gz ubuntu@13.213.1.29:/var/www


# deploy
# cd /var/www/
# tar -xzvf dist.tar.gz nash.market