const tz = require('dayjs/plugin/timezone');
const dayjs = require('dayjs').extend(tz);

export function today(){
    return dayjs().format('YYYY-MM-DD')
}

export function convertUTCToLocalTime(utc: string){
    const time = dayjs(utc).format('YYYY-MM-DD HH:mm')
    return time
}

export function guessTZ(){
    return dayjs.tz.guess()
}