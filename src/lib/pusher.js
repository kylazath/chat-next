import Pusher from 'pusher'

let pusher;

if (global.pusher) {
  pusher = global.pusher
} else {
  global.pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: "eu",
    useTLS: false // true
  })
  pusher = global.pusher
}

export default pusher
