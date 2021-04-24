const moment = require('moment');

function formatMessage(){
    return{
        time:moment().format('h:mm a')
    }
}

module.exports = formatMessage;
