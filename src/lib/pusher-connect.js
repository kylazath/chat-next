import Pusher from 'pusher-js'

const connectToPusher = ({ roomId, onMessageCreated, onPresenceUpdate, currentUser }) => {
  // Pusher.logToConsole = true;
  const pusher = new Pusher('529afc2b93130b2c302c', {
    cluster: 'eu',
    userAuthentication: {
      endpoint: '/api/pusher/authentication',
      transport: "ajax",
      params: {},
      headers: {},
      paramsProvider: null,
      headersProvider: null,
      customHandler: null
    },
    channelAuthorization: {
      endpoint: "/api/pusher/authorization",
      transport: "ajax",
      params: {},
      headers: {},
      customHandler: null
    }
  });
  pusher.signin()

  const channel = pusher.subscribe(roomId);
  channel.bind('message-created', function(data) {
    if (data.message.user.id === currentUser.id) return;

    onMessageCreated(data.message)
  });

  const presenceChannel = pusher.subscribe(`presence-${roomId}`);
  presenceChannel.bind('pusher:subscription_succeeded', () => {
    onPresenceUpdate(presenceChannel.members.members)
  });
  presenceChannel.bind("pusher:subscription_count", () => {
    onPresenceUpdate(presenceChannel.members.members)
  });
  presenceChannel.bind("pusher:member_added", () => {
    onPresenceUpdate(presenceChannel.members.members)
  });
  presenceChannel.bind("pusher:member_removed", () => {
    onPresenceUpdate(presenceChannel.members.members)
  });

  return pusher
}

export default connectToPusher
