#!/usr/bin/env python
#coding:utf-8
import requests,json,time
url="http://127.0.0.1:8080/api/getAword"
headers={'Content-Type':'application/json;charset=UTF-8'}
for num in range(1,37):
    request_param={"id":num}
    response=requests.get(url,params=request_param, headers=headers)
    time.sleep(0.2)
    print(response.text)
   

