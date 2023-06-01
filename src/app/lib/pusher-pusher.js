import Pusher from 'pusher'

let pusher;

// global.pusher = global.pusher ?? new Pusher({
//   appId: "1610366",
//   key: "529afc2b93130b2c302c",
//   secret: "e1ef7e7b6d3c840d3c81",
//   cluster: "eu",
//   useTLS: false // true
// })
// pusher = global.pusher

if (global.pusher) {
  pusher = global.pusher
} else {
  global.pusher = new Pusher({
    appId: "1610366",
    key: "529afc2b93130b2c302c",
    secret: "e1ef7e7b6d3c840d3c81",
    cluster: "eu",
    useTLS: false // true
  })
  pusher = global.pusher
}

export default pusher
