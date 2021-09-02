const makeBotGreetUser = ({ dispatch }) => next => action => {
  if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
    dispatch({
      meta: {
        method: 'keyboard',
      },
      payload: {
        activity: {
          channelData: {
            postBack: true,
          },
          // Web Chat will show the 'Greeting' System Topic message which has a trigger-phrase 'hello'
          name: 'startConversation',
          type: 'event',
          value: {
            CustomIsLoggedIn: 'true',
            csrfToken:
              '+4vVKlYF6i9qb16wtn3563n01CpMQ6Z97B8julF8A2uTcRCghM6l1iYeiEAtAC7epAwzvNPTFylcGPmR4Tlxgw==',
            apiSession:
              'bchCeRV%2B8xGYP6yE3XYDEaIYwxucs7VdRrTb9uw%2BhQW8HN4EF6ma2D%2BGwAYFN1ORqKmdemniKs7NB2m4N%2B8LNiZPn8R6fjJd1x1dBn%2F1HhtA89i%2FaC1TVdpmIAE882q95IwVoMePryyIBYWqlJY0T0LXCcRdbK2V0qRKAJd%2FkkOQIk%2BAnLyUcI64AzFplGAvDTRl7nyqEiH5qj0auzB8ZLySob2Kmq5TpSSss6OcnaztGDXIAJR7uXr9hPiZGTWeOTcn%2FiQgPj1qvnCxARHJWDntsfZGaZlSu005flmQZ4SpfCDi9%2ByHjwpaDWxWsQOgNEt0CHhJnF26ZghvVmcJK9yvTyIhnT5IfZWTMjYZ9%2BJEB3WDx%2B06566mq%2FTAaj6YamhQJBmcSLgoWC3wnS9WJZ1GnrJVA3y3MyQzcbGJ%2BwzrpvpclNxY9wXF%2Fvojp5iuNeFrbNLPIoNtSTRM98LG84n7kl88a0C%2Fwrajh7WARYY2r6zZ9Au8dyWgfRacSNLoE6zHaezJVsjD%2BkMrr%2BBUYJZYnr0YI%2FCS5mJpZufBJQCdNn6VsMV9%2F8OAG%2BxCkZGmwpHSb8%2Fw50lvavH%2F%2FXxe6p%2FtbnL%2FSmt%2Fh%2BS2exeifJ2zwTQPdVTKSyzzDMCxXWZP%2BI3JGlLJ5IncbNZjwOMiyIrMbefu97ueG1kgHBTjNIEzRVtJgA%2B2DrZtiJOh5r4ZXOiXwpOK3%2FKaXFBxd%2Byjgp69zJdEE1OEEvAs5ZBvko7dIthLmo1PaqV0cpOBKILiCTho1jKbaTR8NYKIfB1odnRrUPdSrQ9JX05p--6wzorwhDgMKo4c7r--e1ee8SUVJbpInDikprxPRw%3D%3D',
          },
        },
      },
      type: 'DIRECT_LINE/POST_ACTIVITY',
    });
  }
  return next(action);
};

export default makeBotGreetUser;
