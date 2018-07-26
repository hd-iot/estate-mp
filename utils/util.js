const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const formatHtml = html=>{
  let maxSize = 36;
  let reg = /font-size: (\d+)px/g;
  let value = html.replace(reg, function (a, b, c) {
    let s = parseInt(b);
    if (s > maxSize) {
      s = maxSize;
    }
    return 'font-size: ' + s + 'px';
  });
  value = value.replace(/section/gi, 'div').replace(/\<img/gi, '<img style="width:100%;height:auto" ');
  return value;
}

module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  formatHtml: formatHtml
}
