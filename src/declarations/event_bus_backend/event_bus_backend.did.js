export const idlFactory = ({ IDL }) => {
  const Event = IDL.Text;
  return IDL.Service({
    'emit' : IDL.Func([Event], [], []),
    'list_recent' : IDL.Func([IDL.Nat64], [IDL.Vec(Event)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
