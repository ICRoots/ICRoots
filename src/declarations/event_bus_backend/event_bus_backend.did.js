export const idlFactory = ({ IDL }) => {
  const Event = IDL.Record({ 'message' : IDL.Text, 'timestamp' : IDL.Nat64 });
  return IDL.Service({
    'emit' : IDL.Func([IDL.Text], [], []),
    'get_events' : IDL.Func([], [IDL.Vec(Event)], ['query']),
    'list_recent' : IDL.Func([IDL.Nat64], [IDL.Vec(IDL.Text)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
