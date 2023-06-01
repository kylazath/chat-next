const formatMessagesTime = (messages) => {
  return messages.map((message) => {
    const date = new Date(message.createdAt)
    message.createdAt = `${date.toLocaleTimeString()} ${date.toLocaleDateString()}`
    return message
  })
}

export default formatMessagesTime;
