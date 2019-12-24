
import requests,json
url="http://192.168.10.252:8081/saasweb/login"
headers={'Content-Type':'application/json;charset=UTF-8'}
request_param={"userName":"13556886172","pwd":"m123456","orgDomain":"gotten.17got.com","orgCode":"J1489370545132"}
response=requests.put(url,params=request_param, headers=headers)
print(response.text)
   

