let initialstate={box:Boolean,conversationID:null};
const MessageReducer=(state=initialstate,action)=>{
        
        switch(action.type){

                case "SHOWBOX":
                   return {...state,box:action.payload};
                case "SETCONVERSATIONID":
                    return {...state,conversationID:action.payload};
                default:
                        return state;
        }
     
}

export default MessageReducer;