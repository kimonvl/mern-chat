export const selectOnlineConversations = (state) => {
    let data = state.onlineConversations.onlineConversations;
    data.online.forEach((convo) => {
        const name = convo.participants.reduce((accumulator, participant) => {
            return accumulator ? `${accumulator}, ${participant.username}` : participant.username;
          }, ""); 
        convo.convName = name;
    });
    data.offline.forEach((convo) => {
        const name = convo.participants.reduce((accumulator, participant) => {
            return accumulator ? `${accumulator}, ${participant.username}` : participant.username;
          }, ""); 
        convo.convName = name;
    });
    return data;
}