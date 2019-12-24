let storageClass = {
    judgeLogin() {
        let USERINFO = localStorage.getItem('USERINFO');
        if (USERINFO) {
            return true;
        } else {
            return false;
        }
    }
}
module.exports = storageClass;