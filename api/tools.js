const path = require('path')
var fs = require('fs');
var toolClass = {
    /** 
     * @id 用户id
     * 用户表sql
     * @params 需要修改的键值对
     */
    changeJsonUser(id, params) {
        fs.readFile(path.resolve('./api/user.json'), function (err, data) {
            if (err) {
                console.error(err);
            }
            var res = JSON.parse(data.toString());
            var userList = JSON.parse(JSON.stringify(res.data.userInfo));
            for (var i = 0; i < userList.length; i++) {
                if (id == userList[i].id) {
                    Object.keys(params).forEach(key => {
                        userList[i][key] = params[key];
                    });
                }
            }
            res.data.userInfo = userList;
            var str = JSON.stringify(res);
            fs.writeFileSync(path.resolve('./api/user.json'), str);
        })
    },
    /** 
     * @url json地址
     * @jsonStr 传入的json字符串
     */
    changeJson(url, jsonStr) {
        fs.writeFile(path.resolve(url), jsonStr, function (err) {
            if (err) {
                console.log(err)
            }
        })
    },

    /** 
     * @level 获奖名次
     * @params 需要修改的键值对
     * @info  获奖人信息
     */
    changeJsonGift(level, params, info) {
        fs.readFile(path.resolve('./api/gift.json'), function (err, data) {
            if (err) {
                console.error(err);
            }
            var res = JSON.parse(data.toString());
            var giftList = JSON.parse(JSON.stringify(res.data.giftList));
            for (var i = 0; i < giftList.length; i++) {
                if (level == giftList[i].level) {
                    Object.keys(params).forEach(key => {
                        giftList[i][key] = params[key];
                    });
                    giftList[i].list.push(info);
                }
            }
            res.data.giftList = giftList;
            var str = JSON.stringify(res);
            fs.writeFile(path.resolve('./api/gift.json'), str, function (err) {
                if (err) {}
            })
        })
    },
    /** 
     * @url 读取JSON的相对路径（默认第一层为data）
     */
    readJsonSync(url) {
        var data = fs.readFileSync(path.resolve(url), 'utf-8');
        var res = JSON.parse(data.toString());
        var JsonList = JSON.parse(JSON.stringify(res.data));
        return JsonList;
    },
    /** 
     * @url 读取JSON的相对路径（默认第一层为data）
     */
    readJson(url, callback) {
        fs.readFile(path.resolve(url), 'utf-8', function (err, data) {
            callback(JSON.parse(data))
        });
    },
    /** 
     * @min 最小值
     * @max 最大值
     * @return 随机数
     */
    getRandom(min, max) {
        return Math.floor(Math.random() * (min - max) + max) + Number(Math.random().toFixed(4));
    },
    /** 
     * @id id
     * @return 是否登录状态
     */
    checkLogin(id) {
        let result = false;
        var dataUser = this.readJsonSync('./api/user.json');
        userList = dataUser.userInfo;
        for (let i = 0; i < userList.length; i++) {
            if (userList[i].id == id && userList[i].login) {
                result = true;
            }
        }
        return result;
    },
    /** 
     * @id id
     * @return 用户信息
     */
    getUserInfo(id) {
        let result = {};
        var dataUser = this.readJsonSync('./api/user.json');
        userList = dataUser.userInfo;
        for (let i = 0; i < userList.length; i++) {
            if (userList[i].id == id && userList[i].login) {
                result = userList[i];
            }
        }
        return result;
    },
    /** 
     * @arr 输入的数组
     *洗牌算法
     * @return 输出重新排序的数组
     */
    yateFisher(arr) {
        let i = arr.length;
        while (i) {
            let j = Math.floor(Math.random() * i--); //5555
            [arr[j], arr[i]] = [arr[i], arr[j]];
        }
        console.log(arr)
        return arr;
    },

    getAward(arr, random, giftList) {
        let awardIndex = 0;
        for (let i = 0; i < arr.length; i++) {
            let m = i == 0 ? 0 : arr[i - 1];
            let n = arr[i];
            if (random >= m && random <= n) {
                awardIndex = giftList[i].level;
            }
        }
        if (awardIndex == 0) {
            awardIndex = 4;
        }
        return awardIndex;
    }
}
module.exports = toolClass;