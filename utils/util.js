const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const getAccessToken = (callback) => {
  const apiKey = 'FShXulkUNxuUD3hhY1fjcRHx';
  const secretKey = 'q63vgpihP5NBusDvdIh0FRuXQHzk0A0P';
  const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`;
  
  wx.request({
    url: url,
    method: 'GET',
    success: (res) => {
      if (res.data && res.data.access_token) {
        callback(res.data.access_token);
      } else {
        console.error('Failed to get access token:', res.data);
      }
    },
    fail: (err) => {
      console.error('Failed to get access token:', err);
    }
  });
};


module.exports = {
  formatTime,
  getAccessToken
}
